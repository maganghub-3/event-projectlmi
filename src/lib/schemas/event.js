import { z } from "zod";

export const EVENT_CATEGORIES = [
  { value: "musik", label: "Musik & Konser" },
  { value: "festival", label: "Festival & Kuliner" },
  { value: "workshop", label: "Workshop & Kelas" },
  { value: "seni", label: "Seni & Pameran" },
  { value: "olahraga", label: "Olahraga & Komunitas" },
];

export const createEventSchema = z.object({
  title: z.string().trim().min(5, "Judul event minimal 5 karakter."),
  category: z.string().min(1, "Pilih kategori event."),
  city: z.string().trim().min(2, "Masukkan kota pelaksanaan."),
  venue: z.string().trim().min(3, "Masukkan nama lokasi/venue."),
  date: z.string().min(1, "Pilih tanggal pelaksanaan."),
  price: z.coerce
    .number({ invalid_type_error: "Harga harus berupa angka." })
    .min(0, "Harga tidak boleh negatif."),
  quota: z.coerce
    .number({ invalid_type_error: "Kuota harus berupa angka." })
    .min(1, "Kuota minimal 1 tiket."),
});
