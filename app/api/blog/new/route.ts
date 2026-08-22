import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken"
import { prisma } from "@/lib/db";
import slugify from "slugify"
import cloudinary from "@/lib/cloudinary";

export const POST = async (request: NextRequest) => {
    try {
        const formData = await request.formData();

        const title = formData.get("title");
        const description = formData.get("description");
        const content = formData.get("content");
        const file = formData.get("image");

        if (!title || !description || !content || !(file instanceof File)) {
            return NextResponse.json({ message: "All field must be filled" }, { status: 400 });
        }

        const titleValue = String(title);
        const descriptionValue = String(description);
        const contentValue = String(content);

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

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const MAX_FILE_SIZE_MB = 5; 
        const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

        const uploadResult = await new Promise<{ secure_url: string }>((resolve, reject) => {
            if (file.size > MAX_FILE_SIZE_BYTES) {
                return NextResponse.json(
                    { message: "Image exceed 5MB limit" },
                    { status: 400 }
                );
            }

            const uploadStream = cloudinary.uploader.upload_stream(
                { folder: "blog-posts" },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result as { secure_url: string });
                }
            );

            uploadStream.end(buffer);
        });

        const imageUrl = uploadResult.secure_url;

        if (!imageUrl) return NextResponse.json({ message: "Internal server error: error creating image url" }, { status: 500 });

        const slug = slugify(titleValue, { replacement: "-", lower: true })

        if (!slug) return NextResponse.json({ message: "Internal server error: error creating slug" }, { status: 500 });
        
        const isSlugExist = await prisma.post.findFirst({
            where: {
                authorId: decoded.userId,
                slug: slug
            }
        })

        if (isSlugExist) return NextResponse.json({ message: "Blog name already use in your other blog" }, { status: 400 } )

        await prisma.post.create({
            data: {
                image: imageUrl,
                title: titleValue,
                description: descriptionValue,
                content: contentValue,
                slug: slug,
                author: {
                    connect: {
                        id: decoded.userId,
                    },
                },
            },
        });

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}