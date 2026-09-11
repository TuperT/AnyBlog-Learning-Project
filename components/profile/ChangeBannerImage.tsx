"use client"

import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { ImagePlus } from 'lucide-react'
import { ChangeEvent } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

const ChangeBannerImage = () => {
    const router = useRouter();

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        handleBannerImageUpload(file)
    }

    const handleBannerImageUpload = async (image: File) => {
        if (image.size > MAX_FILE_SIZE_BYTES) {
            toast.error("Image exceeds 5MB limit");
            return;
        }

        const formData = new FormData()
        formData.append("image-banner", image)

        try {
            const res = await fetch("/api/user/update-banner", {
                method: "PUT",
                body: formData,
            })

            const contentType = res.headers.get("content-type") || "";
            const fallbackMessage = res.status === 413
                ? "Image exceeds 5MB limit"
                : "Failed to change banner image";

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

            toast.success("Banner image succesfully change", { duration: 5 })
            router.refresh()
        } catch {
            toast.error("Failed to change banner image");
        }
    }

    return (
        <label className="relative inline-flex cursor-pointer">
            <Input
                type="file"
                accept="image/*"
                onChange={handleInputChange}
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0 z-10"
            />
            
            <Button type="button" variant="outline">
                <ImagePlus /> Change Banner
            </Button>
        </label>
    )
}

export default ChangeBannerImage