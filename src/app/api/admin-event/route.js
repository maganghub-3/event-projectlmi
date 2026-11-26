import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { requireRole } from "@/lib/authMiddleware";

export async function POST(request) {
  const { response } = requireRole(request, "SUPER_ADMIN");
  if (response) return response;

  try {
    const body = await request.json();
    const { nama, email, password, noHp, kota, penyelenggaraId } = body ?? {};

    if (!nama || !email || !password || penyelenggaraId == null) {
      return NextResponse.json(
        {
          error: "nama, email, password, dan penyelenggaraId wajib diisi",
        },
        { status: 400 },
      );
    }

    if (typeof nama !== "string" || nama.trim().length < 3) {
      return NextResponse.json(
        { error: "nama minimal 3 karakter" },
        { status: 400 },
      );
    }

    if (
      typeof email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return NextResponse.json(
        { error: "Format email tidak valid" },
        { status: 400 },
      );
    }

    if (typeof password !== "string" || password.length < 6) {
      return NextResponse.json(
        { error: "Password minimal 6 karakter" },
        { status: 400 },
      );
    }

    const id = Number(penyelenggaraId);
    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json(
        { error: "penyelenggaraId tidak valid" },
        { status: 400 },
      );
    }

    const existing = await prisma.pengguna.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "Email sudah terdaftar" },
        { status: 409 },
      );
    }

    const penyelenggara = await prisma.penyelenggara.findUnique({
      where: { id },
      include: { pengguna: true },
    });
    if (!penyelenggara) {
      return NextResponse.json(
        { error: "Penyelenggara tidak ditemukan" },
        { status: 404 },
      );
    }
    if (penyelenggara.pengguna) {
      return NextResponse.json(
        { error: "Penyelenggara sudah memiliki akun admin" },
        { status: 409 },
      );
    }

    const user = await prisma.pengguna.create({
      data: {
        nama: nama.trim(),
        email,
        kataSandiHash: hashPassword(password),
        noHp: noHp ?? null,
        kota: kota ?? null,
        peran: "ADMIN_EVENT",
        penyelenggaraId: id,
      },
    });

    return NextResponse.json(
      {
        id: user.id,
        nama: user.nama,
        email: user.email,
        peran: user.peran,
        penyelenggaraId: user.penyelenggaraId,
      },
      { status: 201 },
    );
  } catch (err) {
    return NextResponse.json(
      { error: "Gagal membuat akun admin event" },
      { status: 500 },
    );
  }
}

export async function GET(request) {
  const { response } = requireRole(request, "SUPER_ADMIN");
  if (response) return response;

  try {
    const data = await prisma.pengguna.findMany({
      where: { peran: "ADMIN_EVENT" },
      omit: { kataSandiHash: true },
      include: { penyelenggara: true },
    });
    return NextResponse.json(
      data.length == 0 ? { message: "Data ADMIN_EVENT Kosong" } : data,
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal mendapatkan data ADMIN_EVENT" },
      { status: 500 },
    );
  }
}
