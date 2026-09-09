import PostFeed from "@/components/post/PostFeed";
import { buttonVariants } from "@/components/ui/button";
import { prisma } from "@/lib/db";
import {  PenBox } from "lucide-react";
import Link from "next/link";

export default async function Home(
  { searchParams }: 
  { searchParams: Promise<{ search?: string, skip?: string }> }
  ) {
  const params = await searchParams

  const param = new URLSearchParams({
    search: params.search ?? "",
    skip: String(params.skip) ?? 0,
    take: "10"
  })

  const initialPosts = await prisma.post.findMany({
    include: {
      author: {
        select: {
          id: true,
          name: true,
          profilePicture: true
        }
      },
    },
    orderBy: {
      createdAt: "desc"
    },
    skip: Number.isFinite(Number(param.get("skip"))) ? Number(param.get("skip")) : 0,
    take: Number(param.get("take"))
  })

  // TODO Implement search feature
  // const filteredPosts = 
  // posts 
  // ? posts.filter(post => post.title.toLowerCase().includes(param?.search?.toLowerCase() ?? "")) 
  // : posts

  return (
    <div className="mt-12 md:mx-20 lg:mx-40 px-4 sm:px-6 lg:px-0 xl:px-8">
      <header className="flex flex-col gap-2">
        <p className="flex flex-row items-center gap-2 rounded-full py-2 px-4 bg-secondary w-fit text-[2vw] md:text-xs text-secondary-foreground font-semibold font-inter">
          <span className="size-2 bg-primary rounded-full"></span>
          Community Stories
        </p>

        <h1 className="font-jakarta font-bold text-xl sm:text-2xl md:text-3xl">
          Read what the community is <br /> sharing
        </h1>

        <div className="flex flex-row justify-between gap-4">
          <p className="text-muted-foreground font-inter text-[2.4vw] md:text-sm">
            Insightful essays, design thinking, and technical perspectives from authors worldwide.
          </p>

          <Link 
          href="/create"
          className={buttonVariants({ variant: "default", size: "lg" })}
          >
            <PenBox /> Create Blog
          </Link>
        </div>
      </header>

      <PostFeed initialPosts={initialPosts} />
    </div>
  );
}
