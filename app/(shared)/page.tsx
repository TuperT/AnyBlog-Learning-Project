import { BlogCard } from "@/components/blog/BlogCard";
import { BlogCardSkeleton } from "@/components/blog/BlogCardSkeleton";
import BlogSearch from "@/components/blog/BlogSearch";
import { buttonVariants } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { prisma } from "@/lib/db";
import { FileText, PenBox } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

export default async function Home({ searchParams }: { searchParams: Promise<{ search?: string }> }) {
  const param = await searchParams

  const posts = await prisma.post.findMany({
    include: {
      author: {
        select: {
          id: true,
          name: true,
          profilePicture: true
        },
      },
    },
    orderBy: {
      createAt: "desc",
    },
  });

  const filteredPosts = 
  posts 
  ? posts.filter(post => post.title.toLowerCase().includes(param?.search?.toLowerCase() ?? "")) 
  : posts

  return (
    <div className="mt-12 px-4 sm:px-6 lg:px-0 xl:px-8">
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-xl md:text-2xl lg:text-3xl">Blogs</h1>
        <span className="w-sm">
          <BlogSearch />
        </span>
      </div>

      <div className={`mt-5 grid ${posts.length ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "place-items-center"} gap-8`}>
        {posts.length != 0 ? (
          <Suspense fallback={<BlogCardSkeleton />}>
            {
              filteredPosts.map((post) => (
                <BlogCard
                  key={post.id}
                  id={post.id}
                  title={post.title}
                  image={post.image}
                  description={post.description}
                  slug={post.slug}
                  authorId={post.authorId}
                  author={post.author?.name ?? "Unknown"}
                  authorImage={post.author.profilePicture ?? ""}
                  createdAt={post.createAt}
                  updatedAt={post.updatedAt}
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

            <EmptyContent>
              <Link
              href="/create"
              className={buttonVariants({ variant: "default" })}
              >
                <PenBox />
                Let`s create it
              </Link>
            </EmptyContent>
          </Empty>
        )}
      </div>
    </div>
  );
}
