import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/authMiddleware";

export async function POST(request) {
  const { response } = requireRole(request, "SUPER_ADMIN");
  if (response) return response;

  try {
    const body = await request.json();
    const {
      nama,
      logo,
      deskripsi,
      emailKontak,
      teleponKontak,
      status,
    } = body ?? {};

    if (!nama || typeof nama !== "string" || nama.trim().length < 3) {
      return NextResponse.json(
        { error: "nama wajib diisi minimal 3 karakter" },
        { status: 400 },
      );
    }

    if (
      emailKontak != null &&
      (typeof emailKontak !== "string" ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailKontak))
    ) {
      return NextResponse.json(
        { error: "Format emailKontak tidak valid" },
        { status: 400 },
      );
    }

    if (status != null && !["AKTIF", "NONAKTIF"].includes(status)) {
      return NextResponse.json(
        { error: "status harus AKTIF atau NONAKTIF" },
        { status: 400 },
      );
    }

    const penyelenggara = await prisma.penyelenggara.create({
      data: {
        nama: nama.trim(),
        logo: logo ?? null,
        deskripsi: deskripsi ?? null,
        emailKontak: emailKontak ?? null,
        teleponKontak: teleponKontak ?? null,
        status: status ?? "AKTIF",
      },
    });

    return NextResponse.json(penyelenggara, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: "Gagal membuat penyelenggara" },
      { status: 500 },
    );
  }
}

export async function GET(request) {
  // const { response } = requireRole(request, "SUPER_ADMIN");
  // if (response) return response;

  try {
    const penyelenggara = await prisma.penyelenggara.findMany();
    return NextResponse.json(
      penyelenggara.length == 0
        ? { message: "Data Penyelenggara Kosong" }
        : penyelenggara,
    );
  } catch (err) {
    return NextResponse.json(
      { error: "Gagal mengambil penyelenggara" },
      { status: 500 },
    );
  }
}
