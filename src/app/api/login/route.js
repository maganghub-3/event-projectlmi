import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { verifyPassword, signToken } from "../../../lib/auth";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body ?? {};

    if (!email || !password) {
      return NextResponse.json(
        { error: "email dan password wajib diisi" },
        { status: 400 },
      );
    }

    const user = await prisma.pengguna.findUnique({ where: { email } });
    if (!user || !verifyPassword(password, user.kataSandiHash)) {
      return NextResponse.json(
        { error: "Kredensial tidak valid" },
        { status: 401 },
      );
    }

    if (user.status !== "AKTIF") {
      return NextResponse.json({ error: "Akun tidak aktif" }, { status: 403 });
    }

    const token = signToken({
      id: user.id,
      email: user.email,
      peran: user.peran,
    });

    const res = NextResponse.json({
      id: user.id,
      nama: user.nama,
      email: user.email,
      peran: user.peran,
      token,
    });
    res.cookies.set("token", token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, //7 hari
      secure: process.env.NODE_ENV === "production",
    });
    return res;
  } catch (err) {
    return NextResponse.json({ error: "Gagal login" }, { status: 500 });
  }
}
