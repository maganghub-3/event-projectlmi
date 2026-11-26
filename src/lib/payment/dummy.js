import crypto from "crypto";

// Implementasi payment gateway dummy untuk development.
// Tidak menghubungi layanan eksternal dan tidak mengubah status pembayaran.
export class DummyPaymentGateway {
  constructor() {
    // Nama provider yang akan muncul di response API.
    this.name = "DUMMY";
  }

  // Membuat transaksi dummy dan mengembalikan referensi unik.
  async createTransaction({ orderId, amount, method }) {
    // Buat referensi unik dari nomor pesanan + random hex.
    const reference = `DUMMY-${orderId}-${crypto
      .randomBytes(4)
      .toString("hex")
      .toUpperCase()}`;

    // Kembalikan data transaksi dengan bentuk yang sama seperti gateway asli.
    return {
      provider: this.name,
      reference,
      status: "MENUNGGU",
      metode: method,
      amount,
      redirectUrl: null,
      token: null,
      expiresAt: null,
      instructions: [
        "Pembayaran dummy: belum terhubung ke gateway asli.",
        `Pesanan ${orderId} menunggu pembayaran sebesar ${amount}.`,
      ],
    };
  }

  // Placeholder untuk memproses notifikasi/webhook gateway di masa depan.
  async parseNotification(payload) {
    return {
      status: "MENUNGGU",
      reference: payload?.reference ?? null,
      raw: payload,
    };
  }
}
