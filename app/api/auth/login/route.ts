import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import argon2 from "argon2";
import { generateToken } from "@/lib/utils";
import { cookies } from "next/headers";

export const POST = async (request: NextRequest) => {
    try {
        const body = await request.json()
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!body) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        if (!body.email || !body.password) {
            return NextResponse.json({ message: "All fields must be filled" }, { status: 400 });
        }

        if (!emailRegex.test(body.email)) return NextResponse.json({ message: "Invalid email address" }, { status: 400 });

        if (body.password.length < 8) return NextResponse.json({ message: "Password must be at least 8 characters" }, { status: 400 });

        const user = await prisma.user.findUnique({
            where: {
                email: body.email
            },
        })

        if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 })

        const isPasswordCorrect = argon2.verify(user.password, body.password)

        if (!isPasswordCorrect) {
            return NextResponse.json({ message: "Invalid credentials" }, { status: 400 })
        }

        const token = generateToken({ 
            userId: user.id,
            name: user.name,
            profilePicture: user.profilePicture
        });

        (await cookies()).set("jwt", token, {
            maxAge: 7 * 24 * 60 * 60, // 7d in second
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}