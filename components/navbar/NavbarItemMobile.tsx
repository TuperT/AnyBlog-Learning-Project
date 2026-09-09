"use client"

import { House, TextAlignJustify, UsersRound } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import Link from "next/link"
import { buttonVariants } from "../ui/button"
import { useState } from "react"

const NavbarItemMobile = () => {
    const [activeTab, setActiveTab] = useState("Home")

    return (
        <div className="font-inter flex md:hidden">
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <TextAlignJustify className="h-[1.2rem] w-[1.2rem]" />
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="flex flex-col">
                    <DropdownMenuItem 
                    render={
                        <Link
                        href="/"
                        className={`${activeTab == "Home" 
                        ? buttonVariants({ variant: "active" }) 
                        : buttonVariants({ variant: "inactive" })} `}
                        onClick={() => setActiveTab("Home")}
                        >
                            <House /> Home
                        </Link>
                    }
                    >
                        <House /> Home
                    </DropdownMenuItem>

                    <DropdownMenuItem
                    render={
                        <Link
                        href="/users"
                        className={`${activeTab == "Users" 
                        ? buttonVariants({ variant: "active" }) 
                        : buttonVariants({ variant: "inactive" })} `}
                        onClick={() => setActiveTab("Users")}
                        >
                            <UsersRound /> Users
                        </Link>
                    }
                    >
                        <UsersRound /> Users
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

export default NavbarItemMobile