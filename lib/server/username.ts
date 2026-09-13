import "server-only";

import { prisma } from "../db";

export const generateUsername = async(name: string) => {
    const base = name
        .toLowerCase()
        .replace(/[^a-z0-9_]/g, "")
        .slice(0, 15);

    let username = base;

    while (
        await prisma.user.findUnique({
            where: { 
                username: username
            }
        })
    ) {
        const random = Math.floor(1000 + Math.random() * 9000);
        username = `${base}${random}`;
    }

    return username;
}