import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const GET = async (request: NextRequest) => {
    try {
        const params = request.nextUrl.searchParams;

        const search = params.get("search")?.trim() ?? "";
        const skip = Math.max(Number(params.get("skip")) || 0, 0);
        let take = Math.min(Math.max(Number(params.get("take")) || 10, 1), 50);

        if (take > 20) { take = 10 }

        const posts = await prisma.post.findMany({
            where: search
                ? {
                    OR: [
                    { title: { contains: search, mode: "insensitive" } },
                    { description: { contains: search, mode: "insensitive" } },
                    ],
                }
                : undefined,
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        profilePicture: true,
                    },
                },
                categories: {
                    select: {
                        id: true,
                        name: true,
                        color: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
            skip: skip,
            take: take,
        })

        return NextResponse.json(posts);
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { message: "Failed to fetch posts" }, 
            { status: 500 }
        );
    }
};