import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "../../../lib/auth";
import { requireAuth } from "../../../lib/authMiddleware";

export async function POST(request) {
  try {
    const body = await request.json();
    const { nama, email, password, noHp, kota } = body ?? {};

    if (!nama || !email || !password) {
      return NextResponse.json(
        { error: "nama, email, password wajib diisi" },
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

    const user = await prisma.pengguna.create({
      data: {
        nama,
        email,
        kataSandiHash: hashPassword(password),
        noHp: noHp ?? null,
        kota: kota ?? null,
        peran: "PEMBELI",
      },
    });

    return NextResponse.json(
      { id: user.id, nama: user.nama, email: user.email, peran: user.peran },
      { status: 201 },
    );
  } catch (err) {
    return NextResponse.json({ error: "Gagal mendaftar" }, { status: 500 });
  }
}

//develop purpose
export async function GET(request) {
  // const { response } = requireAuth(request);
  // if (response) return response;
  const res = await prisma.pengguna.findMany({
    omit: { kataSandiHash: true },
  });
  return NextResponse.json(res);
}
