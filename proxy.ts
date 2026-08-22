import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import { prisma } from "./lib/db";

export async function proxy(request: NextRequest) {
    try {
        const token = request.cookies.get("jwt")?.value;

        if (!token) {
            return NextResponse.redirect(new URL('/auth/login', request.url))
        }

        if (!process.env.JWT_SECRET) {
            NextResponse.redirect(new URL('/', request.url))
            return NextResponse.json({ message: "Internal server error" }, { status: 500 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;

        if (!decoded.userId) {
            return NextResponse.redirect(new URL('/auth/login', request.url))
        }

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
        });

        if (!user) {
            return NextResponse.redirect(new URL('/auth/login', request.url))
        }

        return NextResponse.next();
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

export const config = {
    matcher: ["/create/:path*", "/edit/:path*"],
};