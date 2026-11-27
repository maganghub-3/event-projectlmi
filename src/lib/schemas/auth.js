import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Masukkan alamat email.")
    .email("Masukkan alamat email yang valid."),
  password: z
    .string()
    .min(1, "Masukkan kata sandi Anda.")
    .min(4, "Kata sandi minimal 4 karakter."),
  rememberMe: z.boolean().optional().default(false),
});
