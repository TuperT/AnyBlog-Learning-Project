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
    updatedAt,
}: BlogCardProps) => {
    const isEdited = updatedAt && new Date(updatedAt).getTime() !== new Date(createdAt).getTime();
    const readingTime = Math.ceil(contentLength / 200)

    return (
        <div className="overflow-hidden p-2 md:p-0 border border-border shadow-card-shadow transition-all duration-250 hover:shadow-card-shadow-hover hover:-translate-y-0.5 rounded-xl w-full h-full grid grid-cols-1 md:grid-cols-[0.8fr_1fr]">
            <div className="p-4 md:p-0">
                <div className="relative min-h-54 md:min-h-68 w-full overflow-hidden rounded-md md:rounded-none">
                    <Image 
                    src={image}
                    alt="blog-image"
                    fill
                    className="object-cover"
                    />
                </div>
            </div>

            <div className="flex min-w-0 flex-col justify-between px-4 md:py-4">
                {/* <div className="flex flex-row items-center">
                    <BlogMenu postId={id} />
                </div> */}

                <div className="flex flex-col gap-2">
                    <h1 className="font-jakarta font-bold text-sm sm:text-md lg:text-lg">
                        {title}
                    </h1>
                    <p className="text-muted-foreground line-clamp-2 sm:line-clamp-3 font-inter text-[3vw] md:text-xs">
                        {description}
                    </p>
                </div>

                <div className="flex flex-row flex-wrap items-center justify-between mt-4 md:mt-0">
                    <div className="flex flex-row gap-2 items-center">
                        <Avatar>
                            <AvatarImage
                            src={authorImage}
                            />

                            <AvatarFallback>
                                {author.at(0)}
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex flex-col md:flex-row md:items-center md:gap-2">
                            <p className="font-semibold text-start leading-tight font-jakarta truncate text-[3vw] sm:text-sm md:text-md">
                                {author}
                            </p>

                            <span className="flex flex-row items-center">
                                <p className="flex flex-row whitespace-nowrap text-[1.6vw] md:text-xs text-muted-foreground font-inter">
                                    {
                                    createdAt && formatDate(updatedAt!) != formatDate(createdAt) 
                                    ? formatDate(createdAt) : `(updated ${formatDate(updatedAt!)})`
                                    }
                                </p>

                                <Dot size={16} />

                                <p className="whitespace-nowrap text-[1.6vw] md:text-xs text-muted-foreground font-inter">
                                    {`${readingTime} min read`}
                                </p>
                            </span>
                        </div>
                    </div>

                    <Link
                    href={`/blog/${authorId}/${slug}`}
                    className={buttonVariants({ variant: "link", className: "group" })}
                    >
                        <span className="flex flex-row items-center">
                            Read blog <ArrowRight size={16} className="transition-all duration-200 ease-in-out delay-75 group-hover:translate-x-1" />
                        </span>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default BlogCard