import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const POST = async (request: NextRequest) => {
    try {
        const body = await request.json();
        const postId = body?.postId;

        if (!postId || typeof postId !== "string") {
            return NextResponse.json({ message: "Invalid post id" }, { status: 400 });
        }

        const existingCookie = request.cookies.get(`blog-view:${postId}`)?.value;
        if (existingCookie === "1") {
            return NextResponse.json({ success: true, deduped: true });
        }

        const [_, userStats] = await Promise.all([
            prisma.postStatistic.upsert({
                where: { 
                    postId 
                },
                update: { 
                    readers: { 
                        increment: 1 
                    } 
                },
                create: {
                    postId,
                    readers: 1 
                },
            }),

            prisma.post.findUnique({
                where: {
                    id: postId 
                },
                select: {
                    authorId: true 
                },
            }),
        ]);

        if (!userStats) {
            return NextResponse.json({ message: "Post not found" }, { status: 404 });
        }

        await prisma.userStatistic.upsert({
            where: {
                userId: userStats.authorId 
            },
            update: { 
                readers: { 
                    increment: 1 
                } 
            },
            create: {
                userId: userStats.authorId, 
                readers: 1 
            },
        });

        const response = NextResponse.json({ success: true });

        response.cookies.set(`blog-view:${postId}`, "1", {
            httpOnly: true,
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24,
        });

        return response;
    } catch (error) {
        console.error("Failed to record blog view:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
};
