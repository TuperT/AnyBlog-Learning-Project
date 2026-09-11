"use client"

import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { ImagePlus } from 'lucide-react'
import { ChangeEvent } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

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
        if (image.size > MAX_FILE_SIZE_BYTES) {
            toast.error("Image exceeds 5MB limit");
            return;
        }

        const formData = new FormData();
        formData.append("image-profile", image);

        try {
            const res = await fetch("/api/user/update-profile", {
                method: "PUT",
                body: formData,
            });

            const contentType = res.headers.get("content-type") || "";
            const fallbackMessage = res.status === 413
                ? "Image exceeds 5MB limit"
                : "Failed to change profile image";

            let result: { message?: string } = {};

            if (contentType.includes("application/json")) {
                try {
                    result = await res.json();
                } catch {
                    result = { message: fallbackMessage };
                }
            } else {
                const text = await res.text();
                if (text) {
                    result = { message: fallbackMessage };
                }
            }

            if (!res.ok) {
                toast.error(result.message || fallbackMessage);
                return;
            }

            toast.success("Profile image successfully changed");
            router.refresh();
        } catch {
            toast.error("Failed to change profile image");
        }
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