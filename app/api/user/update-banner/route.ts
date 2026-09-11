import { prisma } from "@/lib/db";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export const PUT = async (request: NextRequest) => {
    try {
        const formData = await request.formData();
        const file = formData.get("image-banner")

        if(!file) return NextResponse.json({ message: "All field must be filled" }, { status: 400 });

        const token = request.cookies.get("jwt")?.value;

        if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        if (!process.env.JWT_SECRET) return NextResponse.json({ message: "Internal server error" }, { status: 500 });

        const decoded = jwt.verify(token, process.env.JWT_SECRET) as { userId: string };

        if (!decoded) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true, role: true },
        });

        if (!user) {
            const response = NextResponse.json(
                { message: "Session user no longer exists. Please log in again." },
                { status: 401 }
            );
            response.cookies.delete("jwt");
            return response;
        }

        if (!(file instanceof File)) {
            return NextResponse.json({ message: "Image file is required" }, { status: 400 });
        }

        const MAX_FILE_SIZE_MB = 5; 
        const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

        if (file.size > MAX_FILE_SIZE_BYTES && user.role !== "ADMIN") {
            return NextResponse.json(
                { message: "Image exceeds 5MB limit" },
                { status: 413 }
            );
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

        const imageUrl = uploadResult.secure_url;

        await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                bannerPicture: imageUrl
            }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}