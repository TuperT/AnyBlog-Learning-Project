import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { prisma } from "@/lib/db"
import { Shield, UserRound } from "lucide-react"
import Link from "next/link"

const page = async () => {
    const users = await prisma.user.findMany({
        select: {
            name: true,
            profilePicture: true,
            id: true,
            role: true,
        }
    })

    return (
        <main className="mt-5 grid grid-cols-1 gap-4 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-3 lg:px-8 xl:grid-cols-4">
            {users.map((user) => (
                <Card key={user.id} className="p-2">
                    <span className="flex items-center justify-between gap-2">
                        <span className="flex min-w-0 flex-row items-center gap-2">
                            <Avatar size="lg" className="shrink-0">
                                <AvatarImage
                                src={user.profilePicture || "/default-avatar.png"}
                                alt="profile picture"
                                />

                                <AvatarFallback>
                                    {user.name.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <span className="truncate text-sm font-semibold sm:inline sm:text-base">
                                {user.name}
                            </span>
                            <Badge className={`shrink-0 ${user?.role === "ADMIN" ? "bg-linear-to-r from-cyan-400 via-blue-400 to-indigo-400" : ""}`}>
                                {user?.role === "ADMIN" ? <Shield /> : <UserRound />}
                            </Badge>
                        </span>

                        <Link
                        href={`/profile/${user.id}`}
                        className={buttonVariants({ variant: "default", className: "shrink-0" })}
                        >
                            View
                        </Link>
                    </span>
                </Card>
            ))}
        </main>
    )
}

export default page