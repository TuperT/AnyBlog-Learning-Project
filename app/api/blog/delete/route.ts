import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken"
import { prisma } from "@/lib/db";

export const POST = async (request: NextRequest) => {
    try {
        const body = await request.json()

        const token = request.cookies.get("jwt")?.value

        if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        if (!process.env.JWT_SECRET) return NextResponse.json({ message: "Internal server error" }, { status: 500 });

        const decoded = jwt.verify(token, process.env.JWT_SECRET) as { userId: string };

        if (!decoded) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { role: true },
        });

        if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        if(user.role === "USER") return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        if (!body) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        if (!body.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const post = await prisma.post.delete({
            where: {
                id: body.id
            }
        })

        if (!post) return NextResponse.json({ message: "Blog post already deleted" }, { status: 404 });

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error(error);
        return NextResponse.json("Internal server error", { status: 500 });
    }
}