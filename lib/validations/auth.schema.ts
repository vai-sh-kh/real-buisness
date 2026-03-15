import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Please enter your email")
    .email("Please enter a valid email address")
    .max(255, "Please keep email to 255 characters or less")
    .trim()
    .toLowerCase(),
  password: z
    .string()
    .min(1, "Please enter your password")
    .min(6, "Please use at least 6 characters for password")
    .max(128, "Please keep password to 128 characters or less"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
