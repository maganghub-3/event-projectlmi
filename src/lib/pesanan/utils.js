import crypto from "crypto";

// Membuat nomor pesanan unik dengan format PSN-YYYYMMDD-XXXXXXXX.
// Tanggal memudahkan pembacaan, sedangkan random hex mencegah duplikasi.
export function generateNomorPesanan() {
  // Ambil tanggal hari ini dalam format YYYYMMDD.
  const tanggal = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  // Buat 4 byte acak (8 karakter hex) sebagai pembeda antar pesanan.
  const acak = crypto.randomBytes(4).toString("hex").toUpperCase();
  return `PSN-${tanggal}-${acak}`;
}
