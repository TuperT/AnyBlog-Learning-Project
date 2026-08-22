import jwt, { type JwtPayload } from "jsonwebtoken"
import { prisma } from "@/lib/db"
import { cookies } from "next/headers"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { UserRound } from "lucide-react"
import { LogoutMenuItem } from "./LogoutMenuItem"
import Link from "next/link"
import { buttonVariants } from "../ui/button"

type NavJwtPayload = {
    userId: string
    name?: string
    profilePicture?: string | null
}

const NavbarProfile = async () => {
    const token = (await cookies()).get("jwt")

    if (!token) {
        return (
            <div className="flex items-center gap-2">
                <Link href="/auth/signup" className={buttonVariants()}>
                    Sign Up
                </Link>
                <Link
                    href="/auth/login"
                    className={buttonVariants({
                    variant: "outline",
                    })}
                >
                    Login
                </Link>
            </div>
        )
    }
    if (!process.env.JWT_SECRET) return null

    let decoded: string | JwtPayload
    try {
        decoded = jwt.verify(token.value, process.env.JWT_SECRET)
    } catch {
        return (
            <div className="flex items-center gap-2">
                <Link href="/auth/signup" className={buttonVariants()}>
                    Sign Up
                </Link>
                <Link
                    href="/auth/login"
                    className={buttonVariants({
                    variant: "outline",
                    })}
                >
                    Login
                </Link>
            </div>
        )
    }

    if (typeof decoded === "string") {
        return (
            <div className="flex items-center gap-2">
                <Link href="/auth/signup" className={buttonVariants()}>
                    Sign Up
                </Link>
                <Link
                    href="/auth/login"
                    className={buttonVariants({
                    variant: "outline",
                    })}
                >
                    Login
                </Link>
            </div>
        )
    }

    if (!decoded || typeof decoded !== "object") {
        return (
            <div className="flex items-center gap-2">
                <Link href="/auth/signup" className={buttonVariants()}>
                    Sign Up
                </Link>
                <Link
                    href="/auth/login"
                    className={buttonVariants({
                    variant: "outline",
                    })}
                >
                    Login
                </Link>
            </div>
        )
    }
    
    if (!("userId" in decoded) || typeof decoded.userId !== "string") {
        return (
            <div className="flex items-center gap-2">
                <Link href="/auth/signup" className={buttonVariants()}>
                    Sign Up
                </Link>
                <Link
                    href="/auth/login"
                    className={buttonVariants({
                    variant: "outline",
                    })}
                >
                    Login
                </Link>
            </div>
        )
    }

    const payload = decoded as NavJwtPayload

    const user = await prisma.user.findUnique({
        where: {
            id: payload.userId,
        },
        select: {
            id: true,
            name: true,
            profilePicture: true,
        },
    })

    return (
        <>
        {user && (
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <span className="flex items-center gap-2 px-2 hover:bg-accent rounded-xl ">
                        <span className="hidden sm:inline font-semibold text-sm">{user.name}</span>

                        <Avatar>
                            <AvatarImage
                            src={user.profilePicture || "/default-avatar.png"}
                            alt="profile picture"
                            />

                            <AvatarFallback>
                                {user.name.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                    </span>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="flex flex-col items-center justify-center">
                    <DropdownMenuItem>
                        <Link
                        href={`/profile/${user.id}`}
                        className={buttonVariants({ variant: "ghost" })}
                        >
                            <UserRound /> Profile
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <LogoutMenuItem />
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        )}
        </>
    )
}

export default NavbarProfile