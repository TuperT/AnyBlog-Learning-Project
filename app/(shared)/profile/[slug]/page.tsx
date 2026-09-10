import BlogCard from "@/components/blog/BlogCard"
import { BlogCardSkeleton } from "@/components/blog/BlogCardSkeleton"
import BlogSearch from "@/components/blog/BlogSearch"
import ProfileBannerMenu from "@/components/profile/ProfileBannerMenu"
import ProfileImageMenu from "@/components/profile/ProfileImageMenu"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Separator } from "@/components/ui/separator"
import { prisma } from "@/lib/db"
import { FileText, Shield, UserRound } from "lucide-react"
import Image from "next/image"
import { redirect } from "next/navigation"
import { Suspense } from "react"

const Page = async ({ params, searchParams } 
    : { 
        params: Promise<{ slug: string }> ,
        searchParams: Promise<{search?: string}>
    }) => {
    const slug = await params
    const search = await searchParams

    const user = await prisma.user.findUnique({
        where: {
            id: slug.slug
        },
        select: {
            id: true,
            name: true,
            profilePicture: true,
            bannerPicture: true,
            role: true,
            createdAt: true,
            post: {
                orderBy: {
                    createdAt: "desc"
                },
                include: {
                    categories: {
                        select: {
                            id: true,
                            name: true,
                            color: true
                        }
                    }
                }
            },
        }
    })

    // const filteredPosts = 
    // user?.post 
    // ? user?.post.filter(post => post.title.toLowerCase().includes(search?.search?.toLowerCase() ?? "")) 
    // : user?.post
    

    if (!user) redirect("/")

    return (
        <div className="mt-10 flex flex-col gap-8 px-0 sm:px-10 md:px-20 lg:px-30 xl:px-40">
            <Card className="overflow-hidden pt-0">
                <div className="relative">
                    <Image
                    src={user.bannerPicture || "/default-banner.png"}
                    alt="profile picture banner image" 
                    className="relative h-40 sm:h-60 lg:h-80 w-full bg-linear-to-r"
                    width={1000}
                    height={1000}
                    />
                    <ProfileBannerMenu pageIdParam={slug.slug} />
                </div>

                <CardHeader className="relative -mt-14 flex items-center justify-center flex-col md:justify-baseline md:flex-row md:items-end">
                    <div className="relative">
                        <div className="relative size-28 overflow-hidden rounded-full ring-4 ring-background">
                            <Image
                                src={user.profilePicture || "/default-avatar.png"}
                                alt={`${user.name} profile picture`}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <ProfileImageMenu pageIdParam={slug.slug} />
                    </div>

                    <div className="flex flex-1 flex-col md:flex-row items-end justify-between pb-1">
                        <div className="md:ml-4">
                            <span className="flex flex-row items-center justify-center md:justify-start gap-2 md:gap-4">
                                <h1 className="text-2xl font-bold">{user.name}</h1>
                                
                                <span className="flex flex-row">
                                    <Badge className={user?.role === "ADMIN" ? "bg-linear-to-r from-cyan-400 via-blue-400 to-indigo-400" : ""}>
                                        {user?.role === "ADMIN" ? (<><Shield /> <p>ADMIN</p></>) : (<><UserRound /> <p>User</p></>)}
                                    </Badge>
                                </span>
                            </span>

                            <p className="text-sm text-muted-foreground">
                                Member since {new Date(user.createdAt).toLocaleDateString("id-ID", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                })}
                            </p>
                        </div>
                    </div>
                </CardHeader>

                <Separator />

                <CardContent className="flex flex-row justify-around pt-6 text-center">
                    <div>
                        <p className="text-2xl font-bold">{user.post.length}</p>
                        <p className="text-sm text-muted-foreground">Posts</p>
                    </div>

                    <div>
                        <p className="text-2xl font-bold">{user.post.filter((p) => p.published).length}</p>
                        <p className="text-sm text-muted-foreground">Published</p>
                    </div>
                </CardContent>
            </Card>

            <section className="mb-20">
                <div className="flex items-center justify-between">
                    <h1 className="font-bold text-xl">Blogs</h1>
                    <span className="w-sm">
                        <BlogSearch />
                    </span>
                </div>

                {user.post.length === 0 ? (
                    <Empty>
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <FileText />
                            </EmptyMedia>

                            <EmptyTitle>
                                There are no blog yet
                            </EmptyTitle>

                            <EmptyDescription>
                                {user.name} hasn`t create a blog
                            </EmptyDescription>
                        </EmptyHeader>
                    </Empty>
                ) : (
                    <div className="mt-3 grid grid-cols-1 gap-8">
                        {
                            <Suspense fallback={<BlogCardSkeleton />}>
                                {
                                user.post?.map((post) => (
                                    <BlogCard
                                        id={post.id}
                                        key={post.id}
                                        title={post.title}
                                        image={post.image}
                                        description={post.description}
                                        contentLength={post.content.length}
                                        slug={post.slug}
                                        author={user.name}
                                        authorId={post.authorId}
                                        authorImage={user.profilePicture ?? ""}
                                        createdAt={post.createdAt}
                                        updatedAt={post.updatedAt}
                                        categories={post.categories ?? []}
                                    />
                                ))
                                }
                            </Suspense>
                        }
                    </div>
                )}
            </section>
        </div>
    )
}

export default Page