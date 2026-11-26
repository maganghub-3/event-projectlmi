// Endpoint checkout tiket untuk pengguna dengan peran PEMBELI.
// File ini hanya menangani lapisan HTTP: autentikasi, parsing body,
// pemanggilan service, dan pemetaan error menjadi response.
import { NextResponse } from "next/server";
import { requireRole } from "@/lib/authMiddleware";
import { validateCreatePesanan } from "@/lib/pesanan/validation";
import { createPesanan } from "@/lib/pesanan/service";
import { CheckoutError, PaymentGatewayError } from "@/lib/pesanan/errors";

// Helper untuk mengembalikan error validasi dengan status 400.
function badRequest(error) {
  return NextResponse.json({ error }, { status: 400 });
}

// Handler POST /api/pesanan: membuat pesanan baru untuk pembeli.
export async function POST(request) {
  // Pastikan peminta sudah login dan memiliki peran PEMBELI.
  const { user, response } = requireRole(request, "PEMBELI");
  if (response) return response;

  // Ambil body request; jika JSON tidak valid, body menjadi null.
  const body = await request.json().catch(() => null);

  // Validasi struktur input dan normalisasi item.
  const { data, error } = validateCreatePesanan(body);
  if (error) return badRequest(error);

  // Jalankan proses checkout (validasi domain, hitung harga,
  // simpan pesanan, lalu panggil payment gateway).
  try {
    const hasil = await createPesanan({ user, input: data });
    return NextResponse.json(hasil, { status: 201 });
  } catch (err) {
    // Error domain/bisnis sudah membawa status HTTP sendiri (400/404).
    if (err instanceof CheckoutError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    // Gateway gagal membuat transaksi; service sudah melakukan rollback.
    if (err instanceof PaymentGatewayError) {
      return NextResponse.json(
        { error: "Gagal membuat transaksi pembayaran" },
        { status: 502 },
      );
    }
    // Error tak terduga (database, gateway tidak dikenal, dll).
    return NextResponse.json(
      { error: "Gagal membuat pesanan" },
      { status: 500 },
    );
  }
}
