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
    const [hasMore, setHasMore] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const loaderRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (!entry.isIntersecting || isLoading || !hasMore) return;

            setIsLoading(true);

            fetch(`/api/blog/get-post?skip=${skip}&take=10`)
                .then(async (response) => {
                    if (!response.ok) {
                        setHasMore(false);
                        return;
                    }

                    const newPosts: PostFeedPropsAuthor[] = await response.json();

                    if (newPosts.length === 0) {
                        setHasMore(false);
                        return;
                    }

                    setPosts((currentPosts) => [...currentPosts, ...newPosts]);
                    setSkip((currentSkip) => currentSkip + newPosts.length);
                })
                .catch(() => {
                    setHasMore(false);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        });

        if (loaderRef.current) {
            observer.observe(loaderRef.current);
        }

        return () => {
            observer.disconnect();
        };
    }, [skip, isLoading, hasMore]);

    return (
        <>
        <div className={`grid ${posts.length ? "grid-cols-1" : "place-items-center"} gap-4 py-5`}>
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

        <div ref={loaderRef} className="flex h-10 items-center justify-center">
            {
                isLoading && hasMore && <LoaderCircle size={32} className="animate-spin" />
            }
        </div>
        </>
    )
}

export default PostFeed