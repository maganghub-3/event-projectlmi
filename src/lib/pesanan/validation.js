// Modul validasi input pembuatan pesanan.
// Hanya memeriksa struktur/format request dan mengembalikan data yang sudah
// dinormalisasi. Tidak ada akses database di sini.

// Daftar metode pembayaran yang didukung enum MetodePembayaran.
export const METODE_PEMBAYARAN = [
  "VA",
  "QRIS",
  "EWALLET",
  "KARTU_KREDIT",
  "TUNAI",
];

// Memvalidasi body request checkout.
// Mengembalikan { data } jika valid, atau { error } berisi pesan jika tidak.
export function validateCreatePesanan(body) {
  // Body harus berupa objek JSON.
  if (!body || typeof body !== "object") {
    return { error: "Body tidak valid" };
  }

  // eventId wajib berupa bilangan bulat positif.
  const eventId = Number(body.eventId);
  if (!Number.isInteger(eventId) || eventId <= 0) {
    return { error: "eventId tidak valid" };
  }

  // items wajib berupa array dan minimal berisi satu item.
  if (!Array.isArray(body.items) || body.items.length === 0) {
    return { error: "items wajib diisi minimal 1" };
  }

  // Metode pembayaran opsional; jika tidak diisi gunakan "VA".
  const metodePembayaran = body.metodePembayaran ?? "VA";
  if (!METODE_PEMBAYARAN.includes(metodePembayaran)) {
    return { error: "metodePembayaran tidak valid" };
  }

  // Normalisasi tiap item agar tipe datanya konsisten.
  const items = [];
  for (let index = 0; index < body.items.length; index++) {
    // Setiap item harus berupa objek.
    const raw = body.items[index];
    if (!raw || typeof raw !== "object") {
      return { error: `items[${index}] tidak valid` };
    }

    // Ubah id dan jumlah menjadi number; paket bundling menjadi null jika kosong.
    const kategoriTiketId = Number(raw.kategoriTiketId);
    const jumlah = Number(raw.jumlah);
    const paketBundlingId =
      raw.paketBundlingId == null ? null : Number(raw.paketBundlingId);

    // Tolak item jika id kategori tidak valid.
    if (!Number.isInteger(kategoriTiketId) || kategoriTiketId <= 0) {
      return { error: `items[${index}].kategoriTiketId tidak valid` };
    }
    // Jumlah tiket/paket harus bilangan bulat positif.
    if (!Number.isInteger(jumlah) || jumlah <= 0) {
      return {
        error: `items[${index}].jumlah harus bilangan bulat positif`,
      };
    }
    // Jika diisi, paket bundling harus berupa id yang valid.
    if (
      paketBundlingId !== null &&
      (!Number.isInteger(paketBundlingId) || paketBundlingId <= 0)
    ) {
      return { error: `items[${index}].paketBundlingId tidak valid` };
    }

    // Simpan item yang sudah valid ke array hasil normalisasi.
    items.push({ kategoriTiketId, jumlah, paketBundlingId });
  }

  // Kembalikan data siap pakai. Field promo dan data pembeli diteruskan
  // apa adanya karena pengolahan lanjutannya dilakukan di service.
  return {
    data: {
      eventId,
      items,
      metodePembayaran,
      kodePromo: body.kodePromo,
      namaPembeli: body.namaPembeli,
      emailPembeli: body.emailPembeli,
      teleponPembeli: body.teleponPembeli,
    },
  };
}
