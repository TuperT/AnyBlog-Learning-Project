"use client";

import { useEffect, useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { EllipsisVertical, PenBox } from 'lucide-react'
import { DeleteBlogMenuItem } from './DeleteBlogMenuItem'
import Link from 'next/link'
import { buttonVariants } from '../ui/button'

type blogMenuProps = {
    postId: string
}

type CheckUserData = {
    success: boolean;
    post: { slug: string; authorId: string } | null;
    isAdmin: boolean;
    userId: string;
}

const BlogMenu = ({ postId }: blogMenuProps) => {
    const [data, setData] = useState<CheckUserData | null>(null);

    useEffect(() => {
        let cancelled = false;

        const checkUser = async () => {
            try {
                const res = await fetch("/api/user/check-user", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ postId }),
                });

                if (!res.ok) return;

                const json = await res.json();

                if (!cancelled) setData(json);
            } catch {
                return;
            }
        };

        checkUser();

        return () => { cancelled = true; };
    }, [postId]);

    if (!data || !data.post) return null;

    const canManage = data.isAdmin || data.post.authorId === data.userId;

    if (!canManage) return null;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
            className="p-2 rounded-2xl border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input"
            >
                <EllipsisVertical className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
            side="bottom"
            align="end"
            className="w-full flex items-start justify-center flex-col gap-2"
            >
                <Link className={buttonVariants({ variant: "ghost" })} href={`/edit/${data.userId}/${data.post.slug}`}>
                    <PenBox /> Edit Post
                </Link>

                <DeleteBlogMenuItem id={postId} />
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default BlogMenu