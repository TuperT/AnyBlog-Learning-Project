import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken"

export type DecodedToken = JwtPayload & {
    userId: string
    name?: string
    profilePicture?: string | null
}

export const getToken = async (): Promise<DecodedToken | false> => {
    const token = (await cookies()).get("jwt")?.value

    if (!token) return false
    if (!process.env.JWT_SECRET) return false

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if (typeof decoded === "string") return false

        if (typeof decoded.userId !== "string") return false

        return decoded as DecodedToken
    } catch {
        return false
    }
}