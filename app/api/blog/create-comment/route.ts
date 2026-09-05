import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken"
import { prisma } from "@/lib/db";

export const POST = async (request: NextRequest) => {
    try {
        const body = await request.json()

        const token = request.cookies.get("jwt")?.value

        if (!token) return NextResponse.json({ message: "Login/Signin is needed to comment" }, { status: 401 });
        if (!process.env.JWT_SECRET) return NextResponse.json({ message: "Internal server error" }, { status: 500 });

        const decoded = jwt.verify(token, process.env.JWT_SECRET) as { userId: string };

        if (!decoded) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { role: true, id: true },
        });

        if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        if (!body) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        if (!body.comment || !body.postId) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const comment = await prisma.postComment.create({
            data: {
                comment: body.comment,
                postId: body.postId,
                authorId: user.id,
            },
        })

        if (!comment) return NextResponse.json({ message: "Failed to create comment" }, { status: 500 })
        
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error(error);
        return NextResponse.json("Internal server error", { status: 500 });
    }
}