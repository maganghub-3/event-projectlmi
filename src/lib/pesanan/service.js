// Service utama proses checkout.
// Mengatur urutan use-case: validasi domain, perhitungan harga,
// penyimpanan pesanan, dan pemanggilan payment gateway.
import { CheckoutError, PaymentGatewayError } from "./errors";
import { generateNomorPesanan } from "./utils";
import {
  round2,
  hitungSubtotalItem,
  hitungPotonganPromo,
  hitungDasarBiaya,
  hitungBiayaAdmin,
  hitungTotal,
} from "./pricing";
import {
  findEventWithTickets,
  sumTiketTerjual,
  findPromo,
  findActiveBiayaPlatform,
  findBuyerProfile,
  createOrderWithPayment,
  rollbackCheckout,
} from "./repository";
import { createPayment } from "./payment";

// Membuat pesanan baru untuk pembeli.
// `user` berasal dari token (id/email/peran) dan `input` adalah hasil
// normalisasi dari validation.js.
export async function createPesanan({ user, input }) {
  // Ambil event beserta seluruh kategori tiket dan paket bundling-nya.
  const event = await findEventWithTickets(input.eventId);

  // Event wajib ada agar pesanan bisa dibuat.
  if (!event) {
    throw new CheckoutError("Event tidak ditemukan", 404);
  }
  // Tiket hanya bisa dibeli dari event yang sudah dipublikasikan.
  if (event.status !== "PUBLISH") {
    throw new CheckoutError("Event belum dipublikasikan");
  }

  // Siapkan map kategori untuk pencarian cepat, akumulasi unit tiket
  // per kategori, data item untuk disimpan, dan subtotal awal.
  const kategoriById = new Map(
    event.kategoriTiket.map((kategori) => [kategori.id, kategori]),
  );
  const unitPerKategori = new Map();
  const itemData = [];
  let subtotal = 0;

  // Iterasi setiap item tiket/paket yang diminta pembeli.
  for (const item of input.items) {
    // Pastikan kategori tiket memang milik event ini.
    const kategori = kategoriById.get(item.kategoriTiketId);
    if (!kategori) {
      throw new CheckoutError(
        `Kategori tiket ${item.kategoriTiketId} bukan milik event ini`,
      );
    }

    // Cek jendela waktu penjualan tiket.
    if (kategori.penjualanMulai && new Date() < kategori.penjualanMulai) {
      throw new CheckoutError(
        `Penjualan tiket "${kategori.nama}" belum dimulai`,
      );
    }
    if (kategori.penjualanSelesai && new Date() > kategori.penjualanSelesai) {
      throw new CheckoutError(
        `Penjualan tiket "${kategori.nama}" sudah berakhir`,
      );
    }

    // Default: harga satuan dari kategori dan 1 tiket per item.
    let hargaSatuan = Number(kategori.harga);
    let unitTiket = 1;

    // Jika memakai paket bundling, pastikan paket ada dan sesuaikan
    // harga serta jumlah unit tiket yang didapat.
    if (item.paketBundlingId !== null) {
      const paket = kategori.paketBundling.find(
        (p) => p.id === item.paketBundlingId,
      );
      if (!paket) {
        throw new CheckoutError(
          `Paket bundling ${item.paketBundlingId} tidak ditemukan pada kategori "${kategori.nama}"`,
        );
      }
      hargaSatuan = Number(paket.harga);
      unitTiket = paket.jumlah;
    }

    // Hitung subtotal item lalu tambahkan ke subtotal pesanan.
    const subtotalItem = hitungSubtotalItem(hargaSatuan, item.jumlah);
    subtotal = round2(subtotal + subtotalItem);

    // Akumulasi jumlah unit tiket per kategori untuk cek kuota nanti.
    unitPerKategori.set(
      kategori.id,
      (unitPerKategori.get(kategori.id) ?? 0) + unitTiket * item.jumlah,
    );

    // Simpan data item dalam bentuk yang siap ditulis ke database.
    itemData.push({
      kategoriTiketId: kategori.id,
      paketBundlingId: item.paketBundlingId,
      jumlah: item.jumlah,
      hargaSatuan,
      subtotal: subtotalItem,
    });
  }

  // Cek kuota: unit yang sudah terjual + unit yang diminta tidak boleh
  // melebihi kuota kategori tiket.
  for (const [kategoriId, unitDiminta] of unitPerKategori) {
    const kategori = kategoriById.get(kategoriId);
    const sudahTerjual = await sumTiketTerjual(kategoriId);

    if (sudahTerjual + unitDiminta > kategori.kuota) {
      const sisa = Math.max(kategori.kuota - sudahTerjual, 0);
      throw new CheckoutError(
        `Kuota tiket "${kategori.nama}" tidak mencukupi (tersisa ${sisa})`,
      );
    }
  }

  // Siapkan variabel promo; default tanpa promo dan potongan 0.
  let kodePromo = null;
  let potongan = 0;

  // Proses promo hanya jika pembeli mengirim kode promo.
  if (input.kodePromo) {
    // Normalisasi kode promo menjadi string tanpa spasi di ujung.
    const kode = String(input.kodePromo).trim();
    if (!kode) {
      throw new CheckoutError("kodePromo tidak valid");
    }

    // Cari kode promo pada event ini.
    kodePromo = await findPromo(input.eventId, kode);

    // Promo harus ada dan berstatus aktif.
    if (!kodePromo || !kodePromo.aktif) {
      throw new CheckoutError("Kode promo tidak valid");
    }

    // Cek masa berlaku promo.
    const sekarang = new Date();
    if (kodePromo.berlakuDari && sekarang < kodePromo.berlakuDari) {
      throw new CheckoutError("Kode promo belum berlaku");
    }
    if (kodePromo.berlakuSampai && sekarang > kodePromo.berlakuSampai) {
      throw new CheckoutError("Kode promo sudah kedaluwarsa");
    }
    // Cek sisa kuota pemakaian promo.
    if (kodePromo.jumlahDipakai >= kodePromo.kuota) {
      throw new CheckoutError("Kuota kode promo sudah habis");
    }

    // Hitung nominal potongan berdasarkan jenis promo (PERSEN/NOMINAL).
    potongan = hitungPotonganPromo(subtotal, kodePromo);
  }

  // Hitung dasar biaya (subtotal setelah potongan), biaya admin aktif,
  // lalu total akhir yang harus dibayar.
  const dasarBiaya = hitungDasarBiaya(subtotal, potongan);
  const biayaPlatform = await findActiveBiayaPlatform();
  const biayaAdmin = hitungBiayaAdmin(dasarBiaya, biayaPlatform);
  const total = hitungTotal(dasarBiaya, biayaAdmin);

  // Ambil profil pembeli sebagai fallback data kontak.
  const pengguna = await findBuyerProfile(user.id);

  // Tentukan data pembeli: input manual diprioritaskan, lalu profil,
  // lalu email dari token sebagai fallback terakhir.
  const namaPembeli =
    String(input.namaPembeli ?? "").trim() || pengguna?.nama || user.email;
  const emailPembeli =
    String(input.emailPembeli ?? "").trim() || pengguna?.email || null;
  const teleponPembeli =
    String(input.teleponPembeli ?? "").trim() || pengguna?.noHp || null;

  // Tentukan batas waktu pembayaran (default 30 menit).
  const menitKedaluwarsa = Number(process.env.PAYMENT_EXPIRY_MINUTES) || 30;
  const kedaluwarsaPada = new Date(Date.now() + menitKedaluwarsa * 60 * 1000);

  // Buat nomor pesanan unik.
  const nomorPesanan = generateNomorPesanan();

  // Simpan pesanan, item, pembayaran, dan increment pemakaian promo
  // dalam satu transaksi database.
  const { pesanan, pembayaran } = await createOrderWithPayment({
    pesananData: {
      nomorPesanan,
      eventId: input.eventId,
      penggunaId: user.id,
      kodePromoId: kodePromo?.id ?? null,
      sumber: "ONLINE",
      namaPembeli,
      emailPembeli,
      teleponPembeli,
      subtotal,
      potongan,
      biayaAdmin,
      total,
      status: "MENUNGGU",
      kedaluwarsaPada,
    },
    itemData,
    kodePromoId: kodePromo?.id ?? null,
    metode: input.metodePembayaran,
    total,
  });

  // Panggil payment gateway untuk mendapatkan referensi pembayaran.
  let hasilPembayaran;
  try {
    hasilPembayaran = await createPayment({
      pesanan,
      pembayaran,
      metode: input.metodePembayaran,
      total,
      itemData,
      buyer: {
        name: namaPembeli,
        email: emailPembeli,
        phone: teleponPembeli,
      },
    });
  } catch (err) {
    // Jika gateway gagal, batalkan pesanan dan kembalikan kuota promo.
    if (err instanceof PaymentGatewayError) {
      await rollbackCheckout({
        pesananId: pesanan.id,
        pembayaranId: pembayaran.id,
        kodePromoId: kodePromo?.id ?? null,
      });
    }
    // Teruskan error ke route agar dipetakan menjadi 500/502.
    throw err;
  }

  // Kembalikan data pesanan, pembayaran final, dan info pembayaran.
  return {
    pesanan,
    pembayaran: hasilPembayaran.pembayaran,
    payment: hasilPembayaran.payment,
  };
}
