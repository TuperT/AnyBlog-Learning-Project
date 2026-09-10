"use client"

import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { ImagePlus } from 'lucide-react'
import { ChangeEvent } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

const ChangeProfileImage = () => {
    const router = useRouter();

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        console.log("INPUT CHANGE");

        const file = e.target.files?.[0];

        console.log("FILE:", file);

        if (!file) return;

        handleProfileImageUpload(file);
    }

    const handleProfileImageUpload = async (image: File) => {
        const formData = new FormData();
        formData.append("image-profile", image);

        const res = await fetch("/api/user/update-profile", {
            method: "PUT",
            body: formData,
        });

        const result = await res.json();

        if (!res.ok) {
            toast.error(result.message || "Failed to change profile image");
            return;
        }

        toast.success("Profile image successfully changed");
        router.refresh();
    }

    return (
        <label className="relative inline-flex cursor-pointer">
            <Input
                type="file"
                accept="image/*"
                onChange={handleInputChange}
                className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
            />

            <Button type="button" variant="outline">
                <ImagePlus />
                Change Profile
            </Button>
        </label>
    )
}

export default ChangeProfileImage