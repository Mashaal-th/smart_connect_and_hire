import { z } from "zod";

export const formSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    category: z.string().min(1, "Category is required"),
    link: z.string().url("Link must be a valid URL"),
    pitch: z.string().optional(),
    priceMin: z.number().min(0, "Minimum price must be positive"),
    priceMax: z.number().min(0, "Maximum price must be positive"),
  })
  .refine((data) => data.priceMax > data.priceMin, {
    message: "Maximum price must be greater than minimum price",
    path: ["priceMax"],
  });