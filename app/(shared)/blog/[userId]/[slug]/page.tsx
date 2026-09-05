import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { prisma } from "@/lib/db"
import { formatDate } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import Markdown from "@/components/layout/Markdown"
import { Suspense } from "react"
import BlogImageSkeleton from "@/components/blog/BlogImageSkeleton"
import BlogCommentForm from "@/components/blog/BlogCommentForm"
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { MessageCircleQuestionMark } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import BlogCommentCard from "@/components/blog/BlogCommentCard"

const page = async ({ params }: { params: Promise<{ userId:string, slug: string }> }) => {
    const { userId, slug } = await params

    const post = await prisma.post.findFirst({
        where: {
            authorId: userId,
            slug: slug
        },
        include: {
            author: {
                select: {
                    name: true,
                    profilePicture: true,
                },
            },
            comment: {
                select: {
                    comment: true,
                    createAt: true,
                    author: true
                },
            }
        }
    })

    if (!post) return;

    return (
        <section className="grid grid-cols-1 md:grid-cols-[1.2fr_0.5fr] mt-5 gap-6">
            <article className="flex flex-col">
                <Suspense fallback={<BlogImageSkeleton />}>
                    <div className="relative w-full overflow-hidden rounded-2xl aspect-video">
                        <Image
                            src={post?.image ?? "/broken-image.png"}
                            alt={post?.title ?? ""}
                            width={1600}
                            height={900}
                            className="object-cover"
                            loading="eager"
                        />
                    </div>
                </Suspense>

                <div className="flex flex-col mt-3">
                    <h2 className="line-clamp-2 text-2xl font-semibold leading-tight">
                        {post?.title}
                    </h2>

                    <Link href={`/profile/${post?.authorId}`}>
                        <span className="flex flex-row gap-2">
                            <Avatar>
                                {post?.author?.profilePicture && (
                                    <AvatarImage
                                    src={post?.author?.profilePicture}
                                    alt="user blog profile picture"
                                    />
                                )}

                                <AvatarFallback>
                                    {post?.author?.name?.charAt(0 )}
                                </AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-xs">
                                {post?.author?.name}
                                <br />
                                <p className="text-muted-foreground font-normal">
                                    {formatDate(post?.createAt ?? "")}
                                </p>
                            </span>
                        </span>
                    </Link>
                </div>

                <article className="w-full mt-6">
                    <Markdown
                    content={post?.content ?? ""}
                    />
                </article>
            </article>

            <aside className="sticky top-20 mt-2 md:max-h-[80%] overflow-auto pr-2">
                <h1 className="font-semibold">Comments</h1>
                <Separator className="mb-2" />
                <BlogCommentForm postId={post?.id ?? ""} />
                {
                    post?.comment.length >= 1
                    ? (
                        <article className="flex flex-col gap-4 mt-2">
                            {
                            post?.comment?.map((comment, key) => (
                                <BlogCommentCard
                                key={key}
                                authorName={comment.author.name}
                                authorProfilePicture={comment.author.profilePicture?.toString() ?? "./default-avatar.png"}
                                comment={comment.comment}
                                date={comment.createAt}
                                />
                            ))
                            }
                        </article>
                    )
                    : (
                        <Empty className="border-2 border-border mt-2">
                            <EmptyHeader>
                                <EmptyMedia variant="icon">
                                    <MessageCircleQuestionMark />
                                </EmptyMedia>
                                <EmptyTitle>
                                    <p>There`s no comment yet</p>
                                </EmptyTitle>
                            </EmptyHeader>
                        </Empty>
                    )
                }
            </aside>
        </section>
    )
}

export default page