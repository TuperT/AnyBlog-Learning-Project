import Link from "next/link"

const Footer = () => {
    return (
        <footer className="flex flex-col sm:flex-row items-center justify-between px-2 py-4 text-muted-foreground border-t-2 border-border mt-4">
            <p className="font-jakarta text-[12px] md:text-sm">
                &copy; AnyBlog. Minimalist publishing for thoughtful writers.
            </p>

            <span className="flex flex-row items-center gap-4 text-[10px] md:text-xs">
                <Link
                href="/"
                className="transition-all duration-250 hover:text-primary"
                >
                    Home
                </Link>

                <Link
                href="/users"
                className="transition-all duration-250 hover:text-primary"
                >
                    Users
                </Link>

                <Link
                href="/create"
                className="transition-all duration-250 hover:text-primary"
                >
                    Create Post
                </Link>
            </span>
        </footer>
    )
}

export default Footer