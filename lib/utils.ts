import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-EN", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}

export const formatNumber = (num: number) => {
    const formatter = new Intl.NumberFormat('en-US', {
        notation: "compact",
        compactDisplay: "short"
    })

    return formatter.format(num)
}