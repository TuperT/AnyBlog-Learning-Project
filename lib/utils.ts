import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import jwt from "jsonwebtoken";

export type jwtProps = {
  userId: string,
  name?: string,
  profilePicture?: string | null,
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const generateToken = (payload: jwtProps): string => {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) throw new Error("JWT_SECRET not found");

  return jwt.sign(payload, jwtSecret, {
    expiresIn: "7d",
  });
  
};

export const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}