import { getToken } from "@/lib/auth"
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
    try {
        const body = await request.json().catch(() => null)

        if (!body?.postId) return ;
        const token = await getToken()

        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: {
                id: token.userId
            },
            select: {
                role: true,
                id: true
            }
        })

        if(!user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const post = await prisma.post.findUnique({
            where: {
                id: body.postId,
            },
            select: {
                slug: true,
                authorId: true
            }
        })

        return NextResponse.json({
            success: true,
            post,
            isAdmin: user.role === "ADMIN",
            userId: user.id
        });
    } catch {
        return;
    }
}