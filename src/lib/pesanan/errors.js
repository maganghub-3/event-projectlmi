// Error domain untuk kegagalan checkout yang sudah diketahui penyebabnya.
// Properti `status` dipakai route untuk menentukan kode HTTP response.
export class CheckoutError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.name = "CheckoutError";
    this.status = status;
  }
}

// Error khusus ketika payment gateway gagal membuat transaksi.
// Service akan melakukan rollback pesanan sebelum error ini diteruskan.
export class PaymentGatewayError extends Error {
  constructor(message = "Gagal membuat transaksi pembayaran") {
    super(message);
    this.name = "PaymentGatewayError";
  }
}
