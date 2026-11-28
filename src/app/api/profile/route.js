import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/authMiddleware";

function badRequest(error) {
  return NextResponse.json({ error }, { status: 400 });
}

export async function GET(request) {
  const { user, response } = requireAuth(request);
  if (response) return response;

  try {
    const pengguna = await prisma.pengguna.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        nama: true,
        email: true,
        noHp: true,
        kota: true,
        peran: true,
        status: true,
        penyelenggaraId: true,
        dibuatPada: true,
      },
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
      { error: "Gagal mengambil data pengguna" },
      { status: 500 },
    );
  }
}

export async function PATCH(request) {
  const { user, response } = requireAuth(request);
  if (response) return response;

  try {
    const body = await request.json();
    const { nama, noHp, kota } = body ?? {};

    const updateData = {};
    if (nama !== undefined) {
      if (typeof nama !== "string" || nama.trim().length < 3) {
        return badRequest("nama minimal 3 karakter");
      }
      updateData.nama = nama.trim();
    }
    if (noHp !== undefined) {
      updateData.noHp = noHp ?? null;
    }
    if (kota !== undefined) {
      updateData.kota = kota ?? null;
    }

    if (Object.keys(updateData).length === 0) {
      return badRequest("Tidak ada data yang diperbarui");
    }

    const pengguna = await prisma.pengguna.update({
      where: { id: user.id },
      data: updateData,
      select: {
        id: true,
        nama: true,
        email: true,
        noHp: true,
        kota: true,
        peran: true,
        status: true,
        penyelenggaraId: true,
        dibuatPada: true,
      },
    });

    return NextResponse.json(pengguna);
  } catch (err) {
    return NextResponse.json(
      { error: "Gagal memperbarui profil" },
      { status: 500 },
    );
  }
}