import { z } from "zod";

export const PrayerInputSchema = z.object({
  title: z.string().trim().min(2, "Title must be at least 2 characters").max(150),
  body: z.string().trim().min(10, "Prayer text must be at least 10 characters"),
  categoryId: z.string().min(1, "Category ID is required"),
  situationId: z.string().nullable().optional(),
  isPublished: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
});

export const InteractionSchema = z.object({
  prayerId: z.string().min(1, "Prayer ID is required"),
});

export const RegisterSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(50),
  email: z.string().trim().toLowerCase().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});