// Modul perhitungan harga. Semua fungsi murni (tanpa akses database)
// agar mudah diuji dan dipakai ulang.

// Membulatkan angka ke 2 desimal (nilai uang).
export function round2(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

// Menghitung subtotal satu item: harga satuan x jumlah tiket/paket.
export function hitungSubtotalItem(hargaSatuan, jumlah) {
  return round2(hargaSatuan * jumlah);
}

// Menghitung nominal potongan promo.
// PERSEN dihitung dari subtotal; NOMINAL memakai nilai langsung.
// Potongan tidak boleh melebihi subtotal.
export function hitungPotonganPromo(subtotal, kodePromo) {
  const potongan =
    kodePromo.jenisPotongan === "PERSEN"
      ? round2((subtotal * Number(kodePromo.nilaiPotongan)) / 100)
      : round2(Number(kodePromo.nilaiPotongan));

  return round2(Math.min(potongan, subtotal));
}

// Menghitung dasar pengenaan biaya admin (subtotal setelah potongan).
export function hitungDasarBiaya(subtotal, potongan) {
  return round2(subtotal - potongan);
}

// Menghitung total biaya admin dari semua biaya platform yang aktif.
// Nilai bisa PERSEN (dihitung dari dasar biaya) atau NOMINAL.
export function hitungBiayaAdmin(dasarBiaya, daftarBiaya) {
  return round2(
    daftarBiaya.reduce((total, biaya) => {
      const nilai =
        biaya.jenisBiaya === "PERSEN"
          ? (dasarBiaya * Number(biaya.nilaiBiaya)) / 100
          : Number(biaya.nilaiBiaya);
      return total + nilai;
    }, 0),
  );
}

// Menghitung total akhir yang harus dibayar pembeli.
export function hitungTotal(dasarBiaya, biayaAdmin) {
  return round2(dasarBiaya + biayaAdmin);
}
