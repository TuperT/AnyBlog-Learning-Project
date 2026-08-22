import { redirect } from "next/navigation"
import jwt from "jsonwebtoken"
import { prisma } from "@/lib/db"
import { cookies } from "next/headers"
import { toast } from "sonner"
import EditBlog from "@/components/blog/EditBlog"

type jwtPayload = {
    userId: string,
}

const Page = async ({ params }: { params: Promise<{ userId: string, slug: string }> }) => {
    const { userId, slug } = await params

    const cookieStore = await cookies()
    const token = cookieStore.get("jwt")

    if(!token) return redirect("/auth/login")
    if(!process.env.JWT_SECRET) {
        return toast.error("Internal server error: jwt secret not found")
    }

    const decoded = jwt.verify(token.value, process.env.JWT_SECRET)

    if(!decoded) return redirect("/auth/login")

    const payload = decoded as jwtPayload

    const user = await prisma.user.findUnique({
        where: {
            id: payload.userId
        },
        select: {
            role: true,
            name: true,
            profilePicture: true,
        }
    })

    if(!user) return redirect("/")

    const post = await prisma.post.findFirst({
        where: {
            authorId: userId,
            slug: slug,
        }
    })

    if(user.role !== "ADMIN" && payload?.userId !== post?.authorId) return redirect("/")
    if (!post) return redirect("/")

    return (
        <div className="size-full">
            <EditBlog
                initialPost={post}
                user={{ name: user.name, profilePicture: user.profilePicture ?? "/default-avatar.png" }}
            />
        </div>
    )
}

export default Page