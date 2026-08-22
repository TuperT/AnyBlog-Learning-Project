import Link from "next/link"
import { buttonVariants } from "../ui/button"
import { ThemeToggle } from "./theme-toggle"
import NavbarProfile from "../navbar/NavbarProfile"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { House, SquarePen, TextAlignJustify, UsersRound } from "lucide-react"

const NavBar = () => {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-sm">
            <nav className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-0">
                <div className="text-xl md:text-2xl font-bold font-sans">
                    <Link href="/">
                        Any<span className="text-blue-500">Blog</span>
                    </Link>
                </div>

                <div className="hidden items-center gap-2 md:flex">
                    <Link href="/" className={buttonVariants({ variant: "ghost" })}>
                        <House /> Home
                    </Link>

                    <Link href="/users" className={buttonVariants({ variant: "ghost" })}>
                        <UsersRound /> Users
                    </Link>

                    <Link href="/create" className={buttonVariants({ variant: "ghost" })}>
                        <SquarePen /> Create
                    </Link>
                </div>

                <div className="flex items-center gap-2">
                    <NavbarProfile />
                    <ThemeToggle />

                    {/* Mobile Navbar */}
                    <div className="flex md:hidden">
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <TextAlignJustify className="h-[1.2rem] w-[1.2rem]" />
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                    <Link href="/" className={buttonVariants({ variant: "ghost" })}>
                                        <House /> Home
                                    </Link>
                                </DropdownMenuItem>

                                <DropdownMenuItem>
                                    <Link href="/users" className={buttonVariants({ variant: "ghost" })}>
                                        <UsersRound /> Users
                                    </Link>
                                </DropdownMenuItem>

                                <DropdownMenuItem>
                                    <Link href="/create" className={buttonVariants({ variant: "ghost" })}>
                                        <SquarePen /> Create
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </nav>
        </header>
    )
}

export default NavBar