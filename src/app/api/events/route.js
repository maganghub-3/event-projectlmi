import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/authMiddleware";

export async function GET() {
  try {
    const events = await prisma.event.findMany();
    return NextResponse.json(
      events.length == 0 ? { message: "Data Events Kosong" } : events,
    );
  } catch (err) {
    return NextResponse.json(
      { error: "Gagal mengambil event" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  //autentikasi
  const { user, response } = requireRole(request, "ADMIN_EVENT");
  if (response) return response;

  try {
    const body = await request.json();
    const {
      nama,
      poster,
      lokasi,
      kota,
      deskripsi,
      syaratKetentuan,
      mulaiPada,
      selesaiPada,
      visibilitas,
      status,
    } = body ?? {};

    if (!nama || !mulaiPada) {
      return NextResponse.json(
        { error: "nama dan mulaiPada wajib diisi" },
        { status: 400 },
      );
    }

    const pengguna = await prisma.pengguna.findUnique({
      where: { id: user.id },
    });
    if (!pengguna?.penyelenggaraId) {
      return NextResponse.json(
        { error: "Akun admin belum terhubung ke penyelenggara" },
        { status: 400 },
      );
    }

    const event = await prisma.event.create({
      data: {
        penyelenggaraId: pengguna.penyelenggaraId,
        nama,
        poster: poster ?? null,
        lokasi: lokasi ?? null,
        kota: kota ?? null,
        deskripsi: deskripsi ?? null,
        syaratKetentuan: syaratKetentuan ?? null,
        mulaiPada: new Date(mulaiPada),
        selesaiPada: selesaiPada ? new Date(selesaiPada) : null,
        visibilitas: visibilitas ?? "PUBLIK",
        status: status ?? "DRAFT",
      },
    });

    return NextResponse.json(event, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Gagal membuat event" }, { status: 500 });
  }
}
