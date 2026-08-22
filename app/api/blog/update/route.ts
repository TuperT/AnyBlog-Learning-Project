import cloudinary from "@/lib/cloudinary";
import { prisma } from "@/lib/db";
import jwt from "jsonwebtoken"
import { NextRequest, NextResponse } from "next/server";
import slugify from "slugify"

export const PUT = async (request: NextRequest) => {
    try {
        const formData = await request.formData();

        const title = formData.get("title");
        const description = formData.get("description");
        const content = formData.get("content");
        const file = formData.get("image");
        const postId = formData.get("postId")

        if (!title || !description || !content) {
            return NextResponse.json({ message: "All field must be filled" }, { status: 400 });
        }

        if (!postId) return NextResponse.json({ message: "Internal server error: failed to get post id" }, { status: 500 })

        const titleValue = String(title);
        const descriptionValue = String(description);
        const contentValue = String(content);
        const postIdValue = String(postId)

        const token = request.cookies.get("jwt")?.value;

        if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        if (!process.env.JWT_SECRET) return NextResponse.json({ message: "Internal server error" }, { status: 500 });

        const decoded = jwt.verify(token, process.env.JWT_SECRET) as { userId: string };

        if (!decoded) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true },
        });

        if (!user) return NextResponse.json({ message: "Invalid author" }, { status: 404 });
        if (titleValue.length > 100) return NextResponse.json({ message: "Title cannot be longer than 100 characters" }, { status: 400 });
        if (descriptionValue.length < 40) return NextResponse.json({ message: "Description must at least 40 characters length" }, { status: 400 });
        if (descriptionValue.length > 300) return NextResponse.json({ message: "Description cannot be longer than 300 characters" }, { status: 400 });

        let imageUrl: string | undefined;

        if (file instanceof File && file.size > 0) {
            const MAX_FILE_SIZE_MB = 5;
            const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

            if (file.size > MAX_FILE_SIZE_BYTES) {
                return NextResponse.json({ message: "Image exceed 5MB limit" }, { status: 400 });
            }

            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const uploadResult = await new Promise<{ secure_url: string }>((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { folder: "blog-posts" },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result as { secure_url: string });
                    }
                );
                uploadStream.end(buffer);
            });

            imageUrl = uploadResult.secure_url;
            if (!imageUrl) return NextResponse.json({ message: "Internal server error: error creating image url" }, { status: 500 });
        }

        const slug = slugify(titleValue, { replacement: "-", lower: true })

        if (!slug) return NextResponse.json({ message: "Internal server error: error creating slug" }, { status: 500 });
        
        const isSlugExist = await prisma.post.findFirst({
            where: {
                authorId: decoded.userId,
                slug: slug,
                id: { not: postIdValue }
            }
        })

        if (isSlugExist) return NextResponse.json({ message: "Blog name already use in your other blog" }, { status: 400 })

        await prisma.post.update({
            where: {
                id: postIdValue
            },
            data: {
                title: titleValue,
                description: descriptionValue,
                slug: slug,
                content: contentValue,
                ...(imageUrl ? { image: imageUrl } : {}),
            }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}