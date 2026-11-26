import { DummyPaymentGateway } from "./dummy";

// Daftar provider payment gateway yang tersedia.
// Tambahkan provider baru (misalnya midtrans) di sini saat nanti diintegrasikan.
const PROVIDERS = {
  dummy: () => new DummyPaymentGateway(),
};

// Mengembalikan instance payment gateway sesuai env PAYMENT_GATEWAY.
// Default ke "dummy" jika env tidak diisi.
export function getPaymentGateway() {
  const provider = (process.env.PAYMENT_GATEWAY || "dummy").toLowerCase();
  const factory = PROVIDERS[provider];

  // Tolak provider yang belum terdaftar.
  if (!factory) {
    throw new Error(`Payment gateway "${provider}" belum didukung`);
  }

  return factory();
}
