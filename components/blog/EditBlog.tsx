"use client"

import { Post } from "@/lib/generated/prisma/client";
import BlogPreview from "./BlogPreview";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import EditBlogForm from "./EditBlogForm";

type editBlogProps = {
    initialPost: Post
    user: {
        name: string,
        profilePicture: string,
    }
}

export type BlogFormValues = {
    title: string;
    description: string;
    content: string;
    image?: string | File;
};

const EditBlog = ({ initialPost, user }: editBlogProps) => {
    const [previewUrl, setPreviewUrl] = useState<string>(initialPost.image ?? "/broken-image.png");
    const [fileName, setFileName] = useState<string>("")

    const form = useForm<BlogFormValues>({
        defaultValues: {
            title: initialPost.title,
            description: initialPost.description,
            content: initialPost.content,
            image: initialPost.image ?? undefined,
        }
    })

    const { title, description, content } = form.watch()
    const imageValue = form.watch("image");
    
    useEffect(() => {
        if (imageValue && typeof imageValue === "object" && imageValue instanceof File) {
            const file = imageValue;
            setFileName(file.name)
            const objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);

            return () => URL.revokeObjectURL(objectUrl);
        } 
        else if (typeof imageValue === "string") {
            setPreviewUrl(imageValue);
        } 
        else {
            setPreviewUrl(initialPost.image ?? "/broken-image.png");
        }
    }, [imageValue, initialPost.image]);

    return (
        <div className="mt-10 flex w-full flex-col items-start gap-8 md:flex-row">
            <BlogPreview 
            title={title}
            description={description}
            content={content}
            previewUrl={previewUrl}
            name={user?.name ?? ""}
            profilePicture={user?.profilePicture ?? ""}
            />

            <EditBlogForm
            form={form}
            fileName={fileName}
            id={initialPost.id}
            />
        </div>
    )
}

export default EditBlog