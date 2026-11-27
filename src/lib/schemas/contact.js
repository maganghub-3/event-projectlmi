import { z } from "zod";

export const CONTACT_TOPICS = [
  "Pertanyaan seputar tiket",
  "Kendala pembayaran",
  "Pengembalian dana",
  "Kerja sama & sponsor",
  "Menjadi Event Organizer",
  "Lainnya",
];

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Nama minimal 2 karakter."),
  email: z
    .string()
    .trim()
    .min(1, "Email wajib diisi.")
    .email("Format email tidak valid."),
  phone: z
    .string()
    .trim()
    .regex(/^08[\d\s-]{6,15}$/, "Nomor WhatsApp tidak valid (contoh: 0812xxxx)."),
  topic: z.string().min(1, "Pilih topik pesan."),
  message: z.string().trim().min(10, "Pesan minimal 10 karakter."),
});
