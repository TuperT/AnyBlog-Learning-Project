"use client";

import { useEffect, useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { EllipsisVertical, PenBox } from 'lucide-react'
import { DeleteBlogMenuItem } from './DeleteBlogMenuItem'
import Link from 'next/link'
import { buttonVariants } from '../ui/button'

type blogMenuProps = {
    postId: string;
    authorId: string;
}

type CheckUserData = {
    success: boolean;
    post: { slug: string; authorId: string } | null;
    isAdmin: boolean;
    userId: string;
}

let sharedPermissionPromise: Promise<CheckUserData | null> | null = null;
let sharedPermissionData: CheckUserData | null = null;

async function getSharedPermission(): Promise<CheckUserData | null> {
    if (sharedPermissionData) return sharedPermissionData;

    if (!sharedPermissionPromise) {
        sharedPermissionPromise = fetch("/api/user/check-user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({}),
        })
            .then(async (res) => {
                if (!res.ok) return null;

                const json = await res.json();
                sharedPermissionData = json;
                return json;
            })
            .catch(() => null);
    }

    return await sharedPermissionPromise;
}

const BlogMenu = ({ postId, authorId }: blogMenuProps) => {
    const [data, setData] = useState<CheckUserData | null>(sharedPermissionData);

    useEffect(() => {
        let cancelled = false;

        const checkUser = async () => {
            try {
                const json = await getSharedPermission();

                if (!cancelled && json?.success) {
                    setData(json);
                }
            } catch {
                return;
            }
        };

        checkUser();

        return () => { cancelled = true; };
    }, []);

    if (!data?.success || !data.post && !authorId) return null;

    const isOwnPost = authorId === data.userId;
    const canManage = data.isAdmin || isOwnPost;

    if (!canManage) return null;

    const postSlug = data.post?.slug ?? "";

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
            className="p-2 rounded-full border-border bg-background md:bg-none hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input"
            >
                <EllipsisVertical className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
            side="bottom"
            align="end"
            className="w-full flex items-start justify-center flex-col gap-2"
            >
                <Link className={buttonVariants({ variant: "ghost" })} href={`/edit/${data.userId}/${postSlug}`}>
                    <PenBox /> Edit Post
                </Link>

                <DeleteBlogMenuItem id={postId} />
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default BlogMenu