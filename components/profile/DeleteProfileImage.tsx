"use client";

import { Trash2 } from 'lucide-react'
import { Button } from '../ui/button'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation';

type deleteProfileImage = {
    userId: string
}

const DeleteProfileImage = ({ userId }: deleteProfileImage) => {
    const router = useRouter();

    const handleProfileImageDelete = async () => {
        const res = await fetch("/api/user/delete-profile", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id: userId })
        })

        const result = res.json();

        if (!res.ok) {
            toast.error(result || "Failed to delete profile image");
        }

        toast.success("Profile image succesfully deleted", { duration: 5 })
        router.refresh()
    }

    return (
        <Button variant="destructive" onClick={handleProfileImageDelete}>
            <Trash2 /> Delete Profile
        </Button>
    )
}

export default DeleteProfileImage