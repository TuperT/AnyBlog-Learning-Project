import Link from "next/link"
import { buttonVariants } from "../ui/button"
import { ThemeToggle } from "./theme-toggle"
import NavbarProfile from "../navbar/NavbarProfile"
import { PenBox } from "lucide-react"
import NavbarItem from "../navbar/NavbarItem"
import CheckTokenAndReturn from "../middleware/CheckTokenAndReturn"
import NavbarItemMobile from "../navbar/NavbarItemMobile"

const NavBar = () => {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-sm">
            <nav className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-0">
                <div className="flex flex-row gap-6">
                    <Link href="/" className="text-xl font-semibold font-jakarta">
                        AnyBlog
                    </Link>

                    <NavbarItem />
                </div>

                <div className="flex items-center gap-2">
                    <CheckTokenAndReturn 
                    successChildren={
                        <Link 
                        href="/create"
                        className={buttonVariants({ variant: "default" })}
                        >
                            <PenBox /> Create
                        </Link>
                    }
                    />
                    <ThemeToggle />
                    <NavbarProfile />
                    
                    {/* Mobile Navbar */}
                    <NavbarItemMobile />
                </div>
            </nav>
        </header>
    )
}

export default NavBar