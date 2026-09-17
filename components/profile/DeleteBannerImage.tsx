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

        const result = await res.json();

        if (!res.ok) {
            toast.error(result?.message || "Failed to delete banner image");
            return;
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