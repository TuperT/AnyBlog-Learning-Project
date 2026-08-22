import { buttonVariants } from "@/components/ui/button"
import { ArrowLeftToLine } from "lucide-react"
import Link from "next/link"
import React from "react"

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <main className="min-h-screen flex items-center justify-center">
            <div className="absolute top-5 left-5">
                <Link href="/" className={buttonVariants({ variant: "secondary" })}>
                    <ArrowLeftToLine className="size-4" /> Back to Home
                </Link>
            </div>
            
            <div className="w-full max-w-md mx-auto">
                {children}
            </div>
        </main>
    )
}

export default AuthLayout