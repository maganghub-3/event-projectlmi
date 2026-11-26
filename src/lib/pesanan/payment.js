// Modul orkestrasi pembayaran untuk proses checkout.
// Menghubungkan pesanan dengan payment gateway dan menyimpan referensi
// transaksi. Detail gateway tetap berada di folder src/lib/payment.
import { getPaymentGateway } from "@/lib/payment";
import { PaymentGatewayError } from "./errors";
import { updatePaymentReference } from "./repository";

// Membuat transaksi pembayaran untuk pesanan yang sudah tersimpan.
// Mengembalikan pembayaran yang sudah diperbarui beserta data payment
// yang siap dikirim ke response API.
export async function createPayment({
  pesanan,
  pembayaran,
  metode,
  total,
  itemData,
  buyer,
}) {
  // Pilih gateway berdasarkan env PAYMENT_GATEWAY.
  // Sengaja di luar try: error konfigurasi gateway harus menjadi 500,
  // bukan 502.
  const gateway = getPaymentGateway();

  // Minta gateway membuat transaksi pembayaran.
  let transaksi;
  try {
    transaksi = await gateway.createTransaction({
      orderId: pesanan.nomorPesanan,
      amount: total,
      method: metode,
      items: itemData,
      customer: buyer,
    });
  } catch (err) {
    // Bungkus kegagalan gateway agar service bisa melakukan rollback.
    throw new PaymentGatewayError();
  }

  // Simpan referensi transaksi gateway ke record pembayaran.
  // Error di sini dibiarkan sebagai error umum (500) tanpa rollback.
  const pembayaranFinal = await updatePaymentReference(
    pembayaran.id,
    transaksi.reference ?? null,
  );

  // Kembalikan pembayaran final dan data payment yang sudah dinormalisasi.
  return {
    pembayaran: pembayaranFinal,
    payment: {
      provider: transaksi.provider,
      reference: transaksi.reference,
      redirectUrl: transaksi.redirectUrl ?? null,
      token: transaksi.token ?? null,
      expiresAt: transaksi.expiresAt ?? null,
      instructions: transaksi.instructions ?? [],
    },
  };
}
