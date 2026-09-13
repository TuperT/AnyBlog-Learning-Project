import "server-only";

import jwt from "jsonwebtoken";

export type jwtProps = {
    userId: string,
    name?: string,
    profilePicture?: string | null,
}

export const generateToken = (payload: jwtProps): string => {
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) throw new Error("JWT_SECRET not found");

    return jwt.sign(payload, jwtSecret, {
        expiresIn: "7d",
    });
};