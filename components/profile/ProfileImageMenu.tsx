"use server"

import { Pencil } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import DeleteProfileImage from "./DeleteProfileImage"
import ChangeProfileImage from "./ChangeProfileImage"
import { prisma } from "@/lib/db"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"
import type { jwtPayload } from "../blog/BlogMenu"

type profileMenuProps = {
    pageIdParam: string
}

const ProfileImageMenu = async ({ pageIdParam }: profileMenuProps) => {
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

    const admin = user?.role === "ADMIN"
    const userProfile = user?.id === pageIdParam

    return (
        <>
        {admin || userProfile ? (
            <span className="-right-2 bottom-4 lg:left-22 lg:top-16 z-2 flex items-center justify-center absolute rounded-full size-8 bg-accent">
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Pencil className="size-5" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem closeOnClick={false} className="flex items-center justify-center">
                            <ChangeProfileImage />
                        </DropdownMenuItem>

                        <DropdownMenuItem className="flex items-center justify-center">
                            <DeleteProfileImage userId={pageIdParam} />
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </span>
        ) : ""}
        </>
    )
}

export default ProfileImageMenu