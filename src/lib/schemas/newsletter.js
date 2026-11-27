import { z } from "zod";

export const newsletterSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Masukkan alamat emailmu.")
    .email("Format email tidak valid."),
});
