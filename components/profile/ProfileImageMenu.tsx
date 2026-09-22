import { Pencil, SquarePen } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu"
import DeleteProfileImage from "./DeleteProfileImage"
import ChangeProfileImage from "./ChangeProfileImage"
import { prisma } from "@/lib/db"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"
import type { JwtPayload } from "@/types/auth"
import { buttonVariants } from "../ui/button"
import ChangeBannerImage from "./ChangeBannerImage"
import DeleteBannerImage from "./DeleteBannerImage"

type profileMenuProps = {
    userId: string
}

const ProfileImageMenu = async ({ userId }: profileMenuProps) => {
    const token = (await cookies()).get("jwt")

    if(!token) return;
    if(!process.env.JWT_SECRET) return;

    const decoded = jwt.verify(token.value, process.env.JWT_SECRET)

    if(!decoded) return;

    const payload = decoded as JwtPayload

    const user = await prisma.user.findUnique({
        where: {
            id: payload.userId
        },
        select: {
            role: true,
            id: true
        }
    })

    const admin = user?.role === "ADMIN"
    const userProfile = user?.id === userId

    return (
        <>
        {admin || userProfile ? (
            <DropdownMenu>
                <DropdownMenuTrigger className={buttonVariants({ variant: "default", className: "flex flex-row items-center" })}>
                    <SquarePen /> Edit Profile
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuGroup>
                        <DropdownMenuLabel>Profile Image</DropdownMenuLabel>

                        <DropdownMenuItem closeOnClick={false} className="flex items-center justify-center">
                            <ChangeProfileImage />
                        </DropdownMenuItem>

                        <DropdownMenuItem className="flex items-center justify-center">
                            <DeleteProfileImage userId={userId} />
                        </DropdownMenuItem>
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator />

                    <DropdownMenuGroup>
                        <DropdownMenuLabel>Banner Image</DropdownMenuLabel>

                        <DropdownMenuItem
                        closeOnClick={false}
                        className="flex items-center justify-center"
                        >
                            <ChangeBannerImage />
                        </DropdownMenuItem>

                        <DropdownMenuItem
                        className="flex items-center justify-center"
                        >
                            <DeleteBannerImage userId={userId} />
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        ) : ""}
        </>
    )
}

export default ProfileImageMenu