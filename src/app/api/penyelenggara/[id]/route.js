import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request, context) {
  const penyelenggaraId = Number((await context.params).id);
  if (!Number.isInteger(penyelenggaraId) || penyelenggaraId <= 0) {
    return NextResponse.json(
      { error: "ID penyelenggara tidak valid" },
      { status: 400 },
    );
  }

  try {
    const penyelenggara = await prisma.penyelenggara.findUnique({
      where: { id: penyelenggaraId },
    });
    if (!penyelenggara) {
      return NextResponse.json(
        { error: "Penyelenggara tidak ditemukan" },
        { status: 404 },
      );
    }
    return NextResponse.json(penyelenggara);
  } catch (err) {
    return NextResponse.json(
      { error: "Gagal mengambil penyelenggara" },
      { status: 500 },
    );
  }
}
