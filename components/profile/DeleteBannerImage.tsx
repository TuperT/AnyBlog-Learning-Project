"use client";

import { Trash2 } from 'lucide-react'
import { Button } from '../ui/button'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation';

type deleteBannerImage = {
    userId: string
}

const DeleteBannerImage = ({ userId }: deleteBannerImage) => {
    const router = useRouter();

    const handleProfileBannerDelete = async () => {
        const res = await fetch("/api/user/delete-banner", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id: userId })
        })

        const result = res.json();

        if (!res.ok) {
            toast.error(result || "Failed to delete banner image");
        }

        toast.success("Banner image succesfully deleted", { duration: 5 })
        router.refresh()
    }

    return (
        <Button variant="destructive" onClick={handleProfileBannerDelete}>
            <Trash2 /> Delete Banner
        </Button>
    )
}

export default DeleteBannerImage