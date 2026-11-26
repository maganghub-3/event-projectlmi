import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/authMiddleware";

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
