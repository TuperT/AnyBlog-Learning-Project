"use client"

import { Share2 } from "lucide-react"
import { Button } from "../ui/button"
import { toast } from "sonner"

const ShareProfile = () => {
    const handleClick = () => {
        try {
            navigator.clipboard.writeText(window.location.href)

            toast.info("URL copied to clipboard")
        } catch {
            toast.error("Failed to copy URL")
        }
    }

    return (
        <Button variant="outline" onClick={handleClick}>
            <Share2 /> Share Profile
        </Button>
    )
}

export default ShareProfile