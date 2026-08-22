import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "../ui/button";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { formatDate } from "@/lib/utils";
import BlogMenu from "./BlogMenu";

interface BlogCardProps {
    id: string,
    image: string;
    title: string;
    description: string;
    slug: string,
    authorId: string,
    author: string;
    authorImage: string;
    createdAt: Date | string;
    updatedAt?: Date | string;
}

export async function BlogCard({
    id,
    image,
    title,
    description,
    slug,
    author,
    authorId,
    authorImage,
    createdAt,
    updatedAt,
}: BlogCardProps) {
    const isEdited = updatedAt && new Date(updatedAt).getTime() !== new Date(createdAt).getTime();

    return (
        <Card className="overflow-hidden relative gap-3 pb-4 pt-0">
            <BlogMenu postId={id} />

            <div className="relative min-h-58 w-full overflow-hidden">
                <Image
                src={image}
                alt={title}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                fill
                className="object-cover"
                />
            </div>

            <CardHeader>
                <h3 className="line-clamp-2 text-lg font-semibold leading-tight">
                    {title}
                </h3>
            </CardHeader>

            <CardContent className="min-h-16">
                <p className="line-clamp-3 text-sm text-muted-foreground">
                    {description}
                </p>
            </CardContent>

            <CardFooter className="flex items-center justify-between text-xs h-full">
                <Link href={`/profile/${authorId}`}>
                    <span className="flex flex-row gap-2">
                        <Avatar>
                            <AvatarImage
                            src={authorImage}
                            alt="user blog profile picture"
                            />

                            <AvatarFallback>
                                {author.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">
                            {author}
                            <br />
                            <p className="text-muted-foreground font-normal">
                                {formatDate(createdAt)}
                                <br />
                                {isEdited && `(diedit ${formatDate(updatedAt!)})` }
                            </p>
                        </span>
                    </span>
                </Link>
                <span className="flex items-center">
                    <Link href={`/blog/${authorId}/${slug}`}>
                        <Button variant="default">Read Blog</Button>
                    </Link>
                </span>
            </CardFooter>
        </Card>
    );
}