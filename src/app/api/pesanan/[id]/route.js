// Endpoint detail pesanan dan pembaruan status pesanan.
// File ini menangani GET satu pesanan berdasarkan id dan PATCH status
// yang hanya boleh dilakukan oleh ADMIN_EVENT pemilik event terkait.
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/authMiddleware";

const STATUS_PESANAN = ["MENUNGGU", "DIBAYAR", "KEDALUWARSA", "DIBATALKAN"];

function badRequest(error) {
  return NextResponse.json({ error }, { status: 400 });
}

function parseId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

// GET /api/pesanan/[id]: mengambil detail satu pesanan.
export async function GET(request, context) {
  const id = parseId((await context.params).id);
  if (!id) return badRequest("ID pesanan tidak valid");

  try {
    const pesanan = await prisma.pesanan.findUnique({
      where: { id },
      include: {
        event: {
          select: { id: true, nama: true, lokasi: true, mulaiPada: true },
        },
        pengguna: { select: { id: true, nama: true, email: true } },
        item: {
          include: {
            kategoriTiket: { select: { id: true, nama: true, harga: true } },
            paketBundling: {
              select: { id: true, nama: true, jumlah: true, harga: true },
            },
            tiket: true,
          },
        },
        pembayaran: true,
      },
    });
    if (!pesanan) {
      return NextResponse.json(
        { error: "Pesanan tidak ditemukan" },
        { status: 404 },
      );
    }
    return NextResponse.json(pesanan);
  } catch (err) {
    return NextResponse.json(
      { error: "Gagal mengambil pesanan" },
      { status: 500 },
    );
  }
}

// PATCH /api/pesanan/[id]: mengubah status pesanan (khusus ADMIN_EVENT).
export async function PATCH(request, context) {
  const { user, response } = requireRole(request, "ADMIN_EVENT");
  if (response) return response;

  const id = parseId((await context.params).id);
  if (!id) return badRequest("ID pesanan tidak valid");

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") return badRequest("Body tidak valid");
  if (!STATUS_PESANAN.includes(body.status)) {
    return badRequest(
      `status harus salah satu dari ${STATUS_PESANAN.join(", ")}`,
    );
  }

  try {
    const pengguna = await prisma.pengguna.findUnique({
      where: { id: user.id },
      select: { penyelenggaraId: true },
    });
    if (!pengguna?.penyelenggaraId) {
      return badRequest("Akun admin belum terhubung ke penyelenggara");
    }

    const existing = await prisma.pesanan.findUnique({
      where: { id },
      select: { event: { select: { penyelenggaraId: true } } },
    });
    if (!existing) {
      return NextResponse.json(
        { error: "Pesanan tidak ditemukan" },
        { status: 404 },
      );
    }
    if (existing.event.penyelenggaraId !== pengguna.penyelenggaraId) {
      return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
    }

    const pesanan = await prisma.pesanan.update({
      where: { id },
      data: { status: body.status },
    });
    return NextResponse.json(pesanan);
  } catch (err) {
    return NextResponse.json(
      { error: "Gagal memperbarui status pesanan" },
      { status: 500 },
    );
  }
}

export const PUT = PATCH;
