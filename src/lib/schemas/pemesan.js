import { z } from "zod";

export const IDENTITY_OPTIONS = [
  { value: "ktp", label: "KTP" },
  { value: "sim", label: "SIM" },
  { value: "paspor", label: "Paspor" },
  { value: "kartu-pelajar", label: "Kartu Pelajar" },
];

export const attendeeSchema = z
  .object({
    name: z.string().trim().min(2, "Nama minimal 2 karakter"),
    phone: z
      .string()
      .trim()
      .regex(/^08[\d\s-]{6,15}$/, "Nomor WhatsApp tidak valid"),
    email: z
      .string()
      .trim()
      .min(1, "Email wajib diisi")
      .email("Format email tidak valid"),
    identityType: z.enum(["ktp", "sim", "paspor", "kartu-pelajar"]),
    identityNumber: z.string().trim().min(5, "Nomor identitas minimal 5 karakter"),
  })
  .superRefine((data, ctx) => {
    if (data.identityType === "ktp" && !/^\d{16}$/.test(data.identityNumber)) {
      ctx.addIssue({
        code: "custom",
        path: ["identityNumber"],
        message: "Nomor KTP harus 16 digit angka",
      });
    }
  });

export const pemesanSchema = z.object({
  attendees: z.array(attendeeSchema).min(1, "Minimal satu tiket"),
});
