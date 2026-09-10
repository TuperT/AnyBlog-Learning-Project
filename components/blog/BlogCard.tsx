import Image from "next/image";
import { buttonVariants } from "../ui/button";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import BlogMenu from "./BlogMenu";
import { ArrowRight, Sparkles } from "lucide-react";
import { Badge } from "../ui/badge";

export type BlogCardCategory = {
    id: string;
    name: string;
    color: string;
};

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
    categories?: BlogCardCategory[];
    featured?: boolean;
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
    categories = [],
    featured = false,
}: BlogCardProps) => {
    const readingTime = Math.ceil(contentLength / 200)
    const shortDate = new Date(createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
    });
    const [primaryCategory] = categories.slice(0,2);

    return (
        <div className="relative grid w-full h-full grid-cols-1 md:grid-cols-[0.8fr_1fr] md:grid-rows-[auto_1fr] md:gap-x-2 overflow-hidden rounded-3xl md:rounded-xl border border-transparent md:border-border md:bg-card p-3 md:p-0 shadow-card-shadow transition-all duration-250 hover:shadow-card-shadow-hover hover:-translate-y-0.5">
            {/* Pills + menu row */}
            <div className="absolute right-5 top-5 z-10 md:static md:right-0 md:top-0 md:z-0 flex items-center justify-between gap-2 pb-3 md:col-start-2 md:row-start-1 md:px-4 md:pt-4 md:pb-0">
                <div className="flex min-w-0 flex-wrap items-center gap-2">
                    {primaryCategory && (
                        <Badge
                        className="border text-xs font-semibold"
                        style={{
                            backgroundColor: `${primaryCategory.color}1F`,
                            color: primaryCategory.color,
                            borderColor: `${primaryCategory.color}40`,
                        }}
                        >
                            {primaryCategory.name}
                        </Badge>
                    )}
                    {featured && (
                        <Badge className="border-orange-500/30 bg-orange-500/15 text-xs font-semibold text-orange-600 dark:text-orange-400">
                            <Sparkles /> Featured
                        </Badge>
                    )}
                </div>

                <BlogMenu postId={id} />
            </div>

            {/* Cover image */}
            <div className="md:col-start-1 md:row-start-1 md:row-span-2">
                <div className="relative aspect-16/10 sm:aspect-auto sm:min-h-56 lg:min-h-64 xl:min-h-72 w-full overflow-hidden rounded-2xl md:rounded-none">
                    <Image
                        src={image}
                        alt="blog-image"
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 40vw, 320px"
                        className="object-cover"
                    />
                </div>
            </div>

            {/* Title, description, author */}
            <div className="grid min-w-0 grid-rows-[1fr_auto] gap-4 px-1 pt-3 md:col-start-2 md:row-start-2 md:px-4 md:pt-2 md:pb-4">
                <div className="flex min-w-0 flex-col gap-1.5">
                    <h1 className="min-w-0 font-jakarta font-extrabold text-lg sm:text-xl lg:text-2xl leading-snug line-clamp-2">
                        {title}
                    </h1>
                    <p className="min-w-0 text-muted-foreground line-clamp-2 font-inter text-sm">
                        {description}
                    </p>
                </div>

                <div className="flex flex-row items-center justify-between gap-2">
                    <div className="flex min-w-0 flex-row gap-2 items-center">
                        <Avatar size="sm" className="shrink-0">
                            <AvatarImage src={authorImage} />
                            <AvatarFallback>
                                {author.at(0)}
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex min-w-0 flex-col md:flex-row md:items-center md:gap-2 leading-tight">
                            <p className="min-w-0 font-semibold font-jakarta truncate text-xs sm:text-sm">
                                {author}
                            </p>
                            <p className="whitespace-nowrap text-[11px] sm:text-xs text-muted-foreground font-inter">
                                {shortDate} · {`${readingTime} min read`}
                            </p>
                        </div>
                    </div>

                    <Link
                        href={`/blog/${authorId}/${slug}`}
                        className={buttonVariants({ variant: "link", className: "group shrink-0 px-0" })}
                    >
                        <p className="flex flex-row items-center text-sm">
                            Read Article <ArrowRight size={16} className="ml-1 transition-all duration-200 ease-in-out delay-75 group-hover:translate-x-1" />
                        </p>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default BlogCard
