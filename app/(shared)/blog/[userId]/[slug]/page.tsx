import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { prisma } from "@/lib/db"
import { formatDate, formatNumber } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import Markdown from "@/components/layout/Markdown"
import { Suspense } from "react"
import BlogImageSkeleton from "@/components/blog/BlogImageSkeleton"
import BlogCommentForm from "@/components/blog/BlogCommentForm"
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Eye, MessageCircleQuestionMark } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import BlogCommentCard from "@/components/blog/BlogCommentCard"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"

const page = async ({ params }: { params: Promise<{ username:string, slug: string }> }) => {
    const { username, slug } = await params

    const post = await prisma.post.findFirst({
        where: {
            author: {
                username: username
            },
            slug: slug,
        },
        include: {
            author: {
                select: {
                    name: true,
                    username: true,
                    profilePicture: true,
                },
            },
            comments: {
                select: {
                    comment: true,
                    createdAt: true,
                    author: true
                },
            },
            categories: {
                select: {
                    id: true,
                    name: true,
                    color: true
                }
            },
            statistic: {
                select: {
                    readers: true,
                }
            }
        },
    })

    if (!post) return notFound();

    const stats = await prisma.postStatistic.upsert({
        where: {
            postId: post.id,
        },
        update: {
            readers: {
                increment: 1,
            },
        },
        create: {
            postId: post.id,
            readers: 1,
        },
    })

    await prisma.userStatistic.upsert({
        where: {
            userId: post.authorId
        },
        update: {
            readers: {
                increment: 1,
            },
        },
        create: {
            userId: post.authorId,
            readers: 1,
        },
    })

    return (
        <section className="grid grid-cols-1 md:grid-cols-[1.2fr_0.5fr] mt-5 gap-6">
            <article className="flex flex-col gap-4">
                <div className="flex flex-row items-center justify-between">
                    {post.categories.length >=1 
                    ? post.categories.slice(0.2).map((category, key) => (
                            <div key={key} className="flex min-w-0 flex-wrap items-center gap-2">
                                {category && (
                                    <Badge
                                    className="border text-xs font-semibold"
                                    style={{
                                        backgroundColor: `${category.color}1F`,
                                        color: category.color,
                                        borderColor: `${category.color}40`,
                                    }}
                                    >
                                        {category.name}
                                    </Badge>
                                )
                                }
                            </div>
                        ))
                    : <div></div>
                    }
                    <span className="flex flex-row items-center gap-2">
                        <Eye size={16} className="text-primary" />
                        <p className="text-sm opacity-80 font-inter">{formatNumber(stats.readers)} reads</p>
                    </span>
                </div>

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

                <div className="flex flex-col">
                    <h2 className="line-clamp-2 text-2xl font-semibold leading-tight">
                        {post?.title}
                    </h2>

                    <Link href={`/profile/${post.author.username}`}>
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
                                    {formatDate(post?.createdAt ?? "")}
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
                    post?.comments.length >= 1
                    ? (
                        <article className="flex flex-col gap-4 mt-2">
                            {
                            post?.comments?.map((comment, key) => (
                                <BlogCommentCard
                                key={key}
                                authorName={comment.author.name}
                                authorProfilePicture={comment.author.profilePicture?.toString() ?? "./default-avatar.png"}
                                comment={comment.comment}
                                date={comment.createdAt}
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