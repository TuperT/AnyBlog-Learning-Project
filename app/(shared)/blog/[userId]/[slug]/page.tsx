import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { prisma } from "@/lib/db"
import { formatDate } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import Markdown from "@/components/layout/Markdown"
import { Suspense } from "react"
import BlogImageSkeleton from "@/components/blog/BlogImageSkeleton"

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
                }
            }
        }
    })
    
    return (
        <section className="flex justify-center mt-5 px-0 sm:px-20 md:px-30 lg:px-40 xl:px-50">
            <article className="flex flex-col">
                <Suspense fallback={<BlogImageSkeleton />}>
                    <div className="relative w-full overflow-hidden rounded-2xl aspect-video">
                        <Image
                            src={post?.image ?? "/broken-image.png"}
                            alt={post?.title ?? ""}
                            width={1600}
                            height={900}
                            className="object-cover"
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
        </section>
    )
}

export default page