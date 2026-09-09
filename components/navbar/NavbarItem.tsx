"use client"

import { House, UsersRound } from "lucide-react"
import Link from "next/link"
import { buttonVariants } from "../ui/button"
import { useState } from "react"

const NavbarItem = () => {
    const [activeTab, setActiveTab] = useState("Home")

    return (
        <div className="font-inter hidden items-center gap-2 md:flex">
            <Link
            href="/"
            className={`${activeTab == "Home" 
            ? buttonVariants({ variant: "active" }) 
            : buttonVariants({ variant: "inactive" })} `}
            onClick={() => setActiveTab("Home")}
            >
                <House /> Home
            </Link>

            <Link
            href="/users"
            className={`${activeTab == "Users" 
            ? buttonVariants({ variant: "active" }) 
            : buttonVariants({ variant: "inactive" })} `}
            onClick={() => setActiveTab("Users")}
            >
                <UsersRound /> Users
            </Link>
        </div>
    )
}

export default NavbarItem