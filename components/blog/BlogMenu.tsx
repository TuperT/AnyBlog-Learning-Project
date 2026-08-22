import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { CircleEllipsisIcon, PenBox } from 'lucide-react'
import { DeleteBlogMenuItem } from './DeleteBlogMenuItem'
import jwt from "jsonwebtoken"
import { cookies } from 'next/headers'
import { prisma } from '@/lib/db'
import Link from 'next/link'
import { Button } from '../ui/button'

type blogMenuProps = {
    postId: string
}

export type jwtPayload = {
    userId: string,
}

const BlogMenu =  async ({ postId }: blogMenuProps) => {
    const token = (await cookies()).get("jwt")

    if(!token) return;
    if(!process.env.JWT_SECRET) return;

    const decoded = jwt.verify(token.value, process.env.JWT_SECRET)

    if(!decoded) return;

    const payload = decoded as jwtPayload

    const user = await prisma.user.findUnique({
        where: {
            id: payload.userId
        },
        select: {
            role: true,
            id: true
        }
    })

    if(!user) return;

    const post = await prisma.post.findUnique({
        where: {
            id: postId,
            authorId: user.id
        },
        select: {
            slug: true
        }
    })

    const admin = user?.role === "ADMIN"

    return (
        <>
        {
            admin && (
                <DropdownMenu>
                    <DropdownMenuTrigger
                    className="absolute z-10 p-2 right-2 mt-2 rounded-2xl border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input"
                    >
                        <CircleEllipsisIcon className="size-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                    side="bottom"
                    align="end"
                    className="w-full flex items-start justify-center flex-col gap-2"
                    >
                        <Link href={`/edit/${user.id}/${post?.slug}`}>
                            <Button variant="ghost"><PenBox /> Edit Post</Button>
                        </Link>

                        <DeleteBlogMenuItem id={postId} />
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        }
        </>
    )
}

export default BlogMenu