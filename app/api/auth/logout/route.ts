import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const POST = async () => {
    try {
        const cookieStore = await cookies()
        
        cookieStore.set('jwt', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
            expires: new Date(0),
        })

        return NextResponse.json({ success: true });
    } catch (error) {
        console.log("Logout error", error)
        return NextResponse.json({ message: "Internal server error" }, { status: 500 })
    }
}