import { prisma } from "@/lib/db";
import { generateToken } from "@/lib/utils";
import argon2 from "argon2";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
    try {
        const body = await request.json();
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!body) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        if (!body.name || !body.email || !body.password) {
            return NextResponse.json({ message: "All fields must be filled" }, { status: 400 });
        };

        if (body.name.length > 20) {
            return NextResponse.json({ message: "Name cannot be bigger than 20 chars" }, { status: 400 });
        }

        if (!emailRegex.test(body.email)) {
            return NextResponse.json({ message: "Invalid email address" }, { status: 400 });
        }

        if (body.password.length < 8) {
            return NextResponse.json({ message: "Password must be at least 8 characters" }, { status: 400 });
        }

        const findUser = await prisma.user.findUnique({
            where: {
                email: body.email
            }
        })

        if (findUser) return NextResponse.json({ message: "User with this email already exist" }, { status: 409 });

        const user = await prisma.user.create({
            data: {
                name: body.name,
                email: body.email,
                password: await argon2.hash(body.password),
            },
            select: {
                id: true,
                name: true,
                profilePicture: true
            },
        });

        if (!user) return NextResponse.json({ message: "Internal server error" }, { status: 500 });

        const token = generateToken({
            userId: user.id,
            name: user.name,
            profilePicture: user.profilePicture
        });

        (await cookies()).set("jwt", token, {
            maxAge: 7*24*60*60, // 7 day in MS
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: 'strict',
            path: '/'
        })

        return Response.json({ success: true, user });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}