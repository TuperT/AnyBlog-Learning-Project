import Image from "next/image";
import { buttonVariants } from "../ui/button";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { formatDate } from "@/lib/utils";
import BlogMenu from "./BlogMenu";
import { ArrowRight, Dot } from "lucide-react";

interface BlogCardProps {
    id: string,
    image: string;
    title: string;
    contentLength: number,
    description: string;
    slug: string,
    authorId: string,
    author: string;
    authorImage: string;
    createdAt: Date | string;
    updatedAt?: Date | string;
}

const BlogCard = ({
    id,
    image,
    title,
    contentLength,
    description,
    slug,
    author,
    authorId,
    authorImage,
    createdAt,
}: BlogCardProps) => {
    const readingTime = Math.ceil(contentLength / 200)

    return (
        <div className="relative overflow-hidden p-2 sm:p-0 border border-border shadow-card-shadow transition-all duration-250 hover:shadow-card-shadow-hover hover:-translate-y-0.5 rounded-xl w-full h-full grid grid-cols-1 md:grid-cols-[0.8fr_1fr] md:gap-2">
            <div className="p-3 sm:p-0">
                <div className="relative aspect-video sm:aspect-auto sm:min-h-56 lg:min-h-64 xl:min-h-72 w-full overflow-hidden rounded-lg sm:rounded-none">
                    <Image
                        src={image}
                        alt="blog-image"
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 40vw, 320px"
                        className="object-cover"
                    />
                </div>
            </div>

            <div className="absolute top-3 right-3 z-10 flex items-center">
                <BlogMenu postId={id} />
            </div>

            <div className="grid grid-rows-[3fr_0.5fr] min-w-0 gap-4 px-3 py-3 sm:px-4 sm:py-4">
                <div className="flex min-w-0 flex-col gap-2 pr-10">
                    <span>
                        <h1 className="min-w-0 font-jakarta font-bold text-base sm:text-lg lg:text-xl leading-snug">
                            {title}
                        </h1>
                        <p className="w-full text-muted-foreground line-clamp-2 sm:line-clamp-3 font-inter text-xs sm:text-sm">
                            {description}
                        </p>
                    </span>
                </div>

                <div className="flex flex-row flex-wrap items-center mt-2 sm:mt-0">
                    <div className="flex min-w-0 flex-row gap-2 items-center flex-1">
                        <Avatar size="sm" className="shrink-0">
                            <AvatarImage src={authorImage} />
                            <AvatarFallback>
                                {author.at(0)}
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex min-w-0 flex-col lg:flex-row lg:items-center sm:gap-2">
                            <p className="min-w-0 font-semibold text-start leading-tight font-jakarta truncate text-xs sm:text-sm">
                                {author}
                            </p>

                            <span className="flex flex-row items-center min-w-0">
                                <p className="whitespace-nowrap text-[11px] sm:text-xs text-muted-foreground font-inter leading-tight">
                                    {formatDate(createdAt)}
                                </p>

                                <Dot size={16} className="shrink-0" />

                                <p className="whitespace-nowrap text-[11px] sm:text-xs text-muted-foreground font-inter leading-tight">
                                    {`${readingTime} min read`}
                                </p>
                            </span>
                        </div>
                    </div>

                    <Link
                        href={`/blog/${authorId}/${slug}`}
                        className={buttonVariants({ variant: "link", className: "group shrink-0" })}
                    >
                        <p className="flex flex-row items-center text-[14px] sm:text-xs md:text-sm">
                            Read blog <ArrowRight size={16} className="ml-1 transition-all duration-200 ease-in-out delay-75 group-hover:translate-x-1" />
                        </p>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default BlogCard