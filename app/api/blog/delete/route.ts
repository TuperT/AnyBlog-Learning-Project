import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken"
import { prisma } from "@/lib/db";

export const POST = async (request: NextRequest) => {
    try {
        const body = await request.json()

        if (!body.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const token = request.cookies.get("jwt")?.value

        if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        if (!process.env.JWT_SECRET) return NextResponse.json({ message: "Internal server error" }, { status: 500 });

        const decoded = jwt.verify(token, process.env.JWT_SECRET) as { userId: string };

        if (!decoded) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const isPostExist = await prisma.post.findUnique({
            where: {
                id: body.id,
            },
        })

        if (!isPostExist) return NextResponse.json({ message: "Post not found" }, { status: 404 });

        const user = await prisma.user.findUnique({
            where: { 
                id: decoded.userId 
            },
            select: { 
                id: true,
                role: true 
            },
        });

        if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const post = await prisma.post.findUnique({
            where: {
                id: body.id,
                authorId: user?.id
            },
            select: {
                id: true,
                authorId: true,
            }
        })

        if(user.role === "ADMIN") {
            await prisma.post.delete({
                where: {
                    id: post?.id
                }
            })

            return NextResponse.json({ success: true })
        }

        if(user.role == "USER" && post?.authorId !== user.id) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        await prisma.post.delete({
            where: {
                id: body.id
            }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error(error);
        return NextResponse.json("Internal server error", { status: 500 });
    }
}