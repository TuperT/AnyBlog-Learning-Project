"use client"

import { Prisma } from "@/lib/generated/prisma/client"
import { FileText, LoaderCircle} from "lucide-react";
import { Suspense, useEffect, useRef, useState } from "react";
import { BlogCardSkeleton } from "../blog/BlogCardSkeleton";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "../ui/empty";
import BlogCard from "../blog/BlogCard";

type PostFeedPropsAuthor = Prisma.PostGetPayload<{
    select: {
        id: true,
        image: true,
        title: true,
        slug: true,
        description: true,
        content: true,
        published: true,
        authorId: true,
        createdAt: true,
        updatedAt: true,
        author: {
            select: {
                id: true,
                name: true,
                profilePicture: true
            }
        },
        categories: {
            select: {
                id: true,
                name: true,
                color: true
            }
        },
    }
}>

type PostFeedProps = {
    initialPosts: PostFeedPropsAuthor[]
}

const PostFeed = ({ initialPosts }: PostFeedProps) => {
    const [posts, setPosts] = useState(initialPosts);
    const [skip, setSkip] = useState(initialPosts.length);
    const [isNewPostsAvailable, setIsNewPostsAvailable] = useState(false)
    const loadingRef = useRef<boolean>(false)
    const loaderRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(async ([entry]) => {
            if (!entry.isIntersecting || loadingRef.current) return;

            loadingRef.current = true

            try {
                const response = await fetch(`/api/blog?skip=${skip}&take=10`); 
                const newPosts: [] = await response.json();

                setPosts((currentposts) => [...currentposts, ...newPosts])
                setSkip((currentSkips) => currentSkips + newPosts.length)

                const nextNewPost = await (await fetch(`/api/blog?skip=${skip + 10}&take=10`)).json()

                if (nextNewPost) setIsNewPostsAvailable(true)

            } catch {
                setIsNewPostsAvailable(false)
            }
            finally {
                loadingRef.current = false
            }
        })

        if (loaderRef.current) observer.observe(loaderRef.current)

        return () => observer.disconnect()
    }, [skip, isNewPostsAvailable])

    return (
        <>
        <div className={`mt-5 grid ${posts.length ? "grid-cols-1" : "place-items-center"} gap-6`}>
            {posts.length != 0 ? (
            <Suspense fallback={<BlogCardSkeleton />}>
                {
                posts.map((post) => (
                    <BlogCard
                    key={post.id}
                    id={post.id}
                    title={post.title}
                    image={post.image}
                    contentLength={post.content.length}
                    description={post.description}
                    slug={post.slug}
                    authorId={post.authorId}
                    author={post.author.name ?? "Unknown"}
                    authorImage={post.author.profilePicture ?? ""}
                    createdAt={post.createdAt}
                    categories={post.categories ?? []}
                    />
                ))
                }
            </Suspense>
            ) : (
            <Empty>
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <FileText />
                    </EmptyMedia>

                    <EmptyTitle>
                        There are no blog yet
                    </EmptyTitle>

                    <EmptyDescription>
                        Someone hasn`t create a blog
                    </EmptyDescription>
                </EmptyHeader>
            </Empty>
            )}
        </div>

        <div className="flex items-center justify-center">
            {
            loadingRef && isNewPostsAvailable 
            ? <LoaderCircle size={32} className="animate-spin" />
            : ""
            }
        </div>
        </>
    )
}

export default PostFeed