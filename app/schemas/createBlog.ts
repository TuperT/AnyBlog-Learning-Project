import z from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const createBlogSchema = z.object({
    title: z.string().max(100, "Title cannot be longer than 60 characters"),
    description: z
        .string()
        .min(40, "Description must at least 40 characters length")
        .max(300, "Description cannot be longer than 300 characters"),
    image: z
        .instanceof(File, { message: "Please select a valid file." })
        .optional()
        .refine((file) => !file || file.size <= MAX_FILE_SIZE, "Max size is 5MB.")
        .refine(
        (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type),
        "Unsupported format."
        ),
    content: z.string(),
});