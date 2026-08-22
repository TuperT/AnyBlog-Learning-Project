import CreateBlogForm from "@/components/blog/CreateBlogForm"
import { redirect } from "next/navigation"
import jwt from "jsonwebtoken"
import { prisma } from "@/lib/db"
import { cookies } from "next/headers"
import { toast } from "sonner"

type jwtPayload = {
    userId: string,
}

const Page = async () => {
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
            name: true,
            profilePicture: true
        }
    })

    if(!user) {
        return redirect("/")
    }

    return (
        <div className="size-full">
            <CreateBlogForm name={user.name} profilePicture={user.profilePicture ?? ""} />
        </div>
    )
}

export default Page