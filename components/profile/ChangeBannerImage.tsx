"use client"

import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { ImagePlus } from 'lucide-react'
import { ChangeEvent } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

const ChangeBannerImage = () => {
    const router = useRouter();

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        handleBannerImageUpload(file)
    }

    const handleBannerImageUpload = async (image: File) => {
        const formData = new FormData()
        formData.append("image-banner", image)

        const res = await fetch("/api/user/update-banner", {
            method: "PUT",
            body: formData,
        })

        const result = await res.json();

        if (!res.ok) {
            toast.error(result.message || "Failed to change banner image");
            return;
        }

        toast.success("Banner image succesfully change", { duration: 5 })
        router.refresh()
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