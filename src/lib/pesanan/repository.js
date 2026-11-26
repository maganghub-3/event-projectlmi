// Modul akses database untuk proses checkout.
// Semua query Prisma dan transaksi database ditempatkan di sini agar
// service tetap fokus pada aturan bisnis.
import { prisma } from "@/lib/prisma";

// Status pesanan yang dianggap masih mengunci kuota tiket.
const STATUS_PESANAN_AKTIF = ["MENUNGGU", "DIBAYAR"];

// Mengambil event beserta semua kategori tiket dan paket bundling-nya.
export function findEventWithTickets(eventId) {
  return prisma.event.findUnique({
    where: { id: eventId },
    include: {
      kategoriTiket: { include: { paketBundling: true } },
    },
  });
}

// Menghitung jumlah tiket yang sudah terjual untuk satu kategori.
// Jumlah unit memperhitungkan paket bundling (jumlah tiket x jumlah paket).
export async function sumTiketTerjual(kategoriTiketId) {
  const items = await prisma.itemPesanan.findMany({
    where: {
      kategoriTiketId,
      pesanan: { status: { in: STATUS_PESANAN_AKTIF } },
    },
    select: {
      jumlah: true,
      paketBundling: { select: { jumlah: true } },
    },
  });

  return items.reduce(
    (total, item) => total + item.jumlah * (item.paketBundling?.jumlah ?? 1),
    0,
  );
}

// Mencari kode promo berdasarkan event dan kodenya.
export function findPromo(eventId, kode) {
  return prisma.kodePromo.findUnique({
    where: { eventId_kode: { eventId, kode } },
  });
}

// Mengambil semua biaya platform yang sedang aktif.
export function findActiveBiayaPlatform() {
  return prisma.biayaPlatform.findMany({ where: { aktif: true } });
}

// Mengambil data ringkas pembeli untuk fallback data kontak.
export function findBuyerProfile(userId) {
  return prisma.pengguna.findUnique({
    where: { id: userId },
    select: { nama: true, email: true, noHp: true },
  });
}

// Menyimpan pesanan, item pesanan, pembayaran, dan increment promo
// dalam satu transaksi agar semuanya berhasil atau gagal bersama.
export function createOrderWithPayment({
  pesananData,
  itemData,
  kodePromoId,
  metode,
  total,
}) {
  return prisma.$transaction(async (tx) => {
    // Buat pesanan beserta seluruh item-nya.
    const pesanan = await tx.pesanan.create({
      data: {
        ...pesananData,
        item: { create: itemData },
      },
      include: { item: true },
    });

    // Tambah counter pemakaian promo jika pesanan memakai promo.
    if (kodePromoId) {
      await tx.kodePromo.update({
        where: { id: kodePromoId },
        data: { jumlahDipakai: { increment: 1 } },
      });
    }

    // Buat record pembayaran dengan status menunggu.
    const pembayaran = await tx.pembayaran.create({
      data: {
        pesananId: pesanan.id,
        metode,
        jumlah: total,
        status: "MENUNGGU",
      },
    });

    return { pesanan, pembayaran };
  });
}

// Membatalkan hasil checkout ketika pembuatan transaksi gateway gagal.
// Pesanan dibatalkan, pembayaran ditandai gagal, dan kuota promo dikembalikan.
export function rollbackCheckout({ pesananId, pembayaranId, kodePromoId }) {
  const pembatalan = [
    prisma.pesanan.update({
      where: { id: pesananId },
      data: { status: "DIBATALKAN" },
    }),
    prisma.pembayaran.update({
      where: { id: pembayaranId },
      data: { status: "GAGAL" },
    }),
  ];

  // Kembalikan counter promo jika sebelumnya sempat ditambah.
  if (kodePromoId) {
    pembatalan.push(
      prisma.kodePromo.update({
        where: { id: kodePromoId },
        data: { jumlahDipakai: { decrement: 1 } },
      }),
    );
  }

  return prisma.$transaction(pembatalan);
}

// Menyimpan referensi transaksi dari payment gateway ke record pembayaran.
export function updatePaymentReference(pembayaranId, reference) {
  return prisma.pembayaran.update({
    where: { id: pembayaranId },
    data: { referensiGateway: reference },
  });
}
