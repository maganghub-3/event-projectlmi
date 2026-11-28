import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/authMiddleware";

const STATUS_PENGGUNA = ["AKTIF", "DIBLOKIR"];

function badRequest(error) {
  return NextResponse.json({ error }, { status: 400 });
}

function parseId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

// GET /api/admin-event/[id]: ambil detail pengguna by id (SUPER_ADMIN only)
export async function GET(request, context) {
  const id = parseId((await context.params).id);
  if (!id) return badRequest("ID pengguna tidak valid");

  const { response } = requireRole(request, "SUPER_ADMIN");
  if (response) return response;

  try {
    const pengguna = await prisma.pengguna.findUnique({
      where: { id },
      omit: { kataSandiHash: true },
      include: { penyelenggara: true },
    });

    if (!pengguna) {
      return NextResponse.json(
        { error: "Pengguna tidak ditemukan" },
        { status: 404 },
      );
    }

    return NextResponse.json(pengguna);
  } catch (err) {
    return NextResponse.json(
      { error: "Gagal mendapatkan data pengguna" },
      { status: 500 },
    );
  }
}

// PATCH /api/admin-event/[id]: block/unblock status (SUPER_ADMIN only)
export async function PATCH(request, context) {
  const id = parseId((await context.params).id);
  if (!id) return badRequest("ID pengguna tidak valid");

  const { response } = requireRole(request, "SUPER_ADMIN");
  if (response) return response;

  try {
    const body = await request.json();
    if (!body || !body.status) {
      return badRequest("status wajib diisi");
    }

    if (!STATUS_PENGGUNA.includes(body.status)) {
      return badRequest(
        `status harus salah satu dari ${STATUS_PENGGUNA.join(", ")}`,
      );
    }

    const pengguna = await prisma.pengguna.update({
      where: { id },
      data: { status: body.status },
      select: {
        id: true,
        nama: true,
        email: true,
        noHp: true,
        kota: true,
        peran: true,
        status: true,
        penyelenggaraId: true,
      },
    });

    return NextResponse.json(pengguna);
  } catch (err) {
    return NextResponse.json(
      { error: "Gagal memperbarui status pengguna" },
      { status: 500 },
    );
  }
}

// DELETE /api/admin-event/[id]: hapus pengguna (SUPER_ADMIN only)
export async function DELETE(request, context) {
  const id = parseId((await context.params).id);
  if (!id) return badRequest("ID pengguna tidak valid");

  const { response } = requireRole(request, "SUPER_ADMIN");
  if (response) return response;

  try {
    const pengguna = await prisma.pengguna.delete({
      where: { id },
      select: {
        id: true,
        nama: true,
        email: true,
      },
    });

    return NextResponse.json(
      { message: "Pengguna berhasil dihapus", id: pengguna.id },
      { status: 200 },
    );
  } catch (err) {
    return NextResponse.json(
      { error: "Gagal menghapus pengguna" },
      { status: 500 },
    );
  }
}