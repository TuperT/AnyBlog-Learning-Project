import { prisma } from "@/lib/db";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export const PUT = async (request: NextRequest) => {
    try {
        const body = await request.json()

        const token = request.cookies.get("jwt")?.value;

        if (!body.id) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        if (!process.env.JWT_SECRET) return NextResponse.json({ message: "Internal server error" }, { status: 500 });

        const decoded = jwt.verify(token, process.env.JWT_SECRET) as { userId: string, role: string };

        if (!decoded) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        if (body.id != decoded.userId || decoded.role != "ADMIN") return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const user = await prisma.user.findUnique({
            where: { id: body.id },
            select: { id: true },
        });

        if (!user) {
            const response = NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
            return response;
        }

        await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                profilePicture: "/default-avatar.png"
            }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error(error);
        return NextResponse.json("Internal server error", { status: 500 });
    }
}