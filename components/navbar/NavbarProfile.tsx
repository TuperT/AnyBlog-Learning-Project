import { prisma } from "@/lib/db"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuGroup } from "../ui/dropdown-menu"
import { ChevronDown, UserRound } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { LogoutMenuItem } from "./LogoutMenuItem"
import Link from "next/link"
import { buttonVariants } from "../ui/button"
import { getToken } from "@/lib/auth"

const NavbarProfile = async () => {
    const decoded = await getToken()

    if (!decoded) {
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

    const user = await prisma.user.findUnique({
        where: {    
            id: decoded.userId,
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
                    <span className="flex items-center gap-2 px-2 rounded-xl ">
                        <Avatar>
                            <AvatarImage
                            src={user.profilePicture || "/default-avatar.png"}
                            alt="profile picture"
                            />

                            <AvatarFallback>
                                {user.name.charAt(0)}
                            </AvatarFallback>
                        </Avatar>

                        <span className="hidden sm:flex sm:flex-row sm:items-center sm:gap font-semibold text-sm">
                            {user.name} <ChevronDown size={16} />
                        </span>
                    </span>
                </DropdownMenuTrigger>

                <DropdownMenuContent>
                    <DropdownMenuGroup className="flex flex-col justify-center">
                        <DropdownMenuItem render={
                            <Link
                                className={buttonVariants({ variant: "ghost" })}
                                href={`/profile/${user.id}`}
                            >
                                <UserRound /> Profile
                            </Link>
                        }>
                            <UserRound /> Profile
                        </DropdownMenuItem>

                        <LogoutMenuItem />
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        )}
        </>
    )
}

export default NavbarProfile