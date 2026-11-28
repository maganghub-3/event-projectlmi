import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import crypto from "crypto";

const RESET_TOKEN_EXPIRY_DAYS = 1;

export async function POST(request) {
  try {
    const body = await request.json();
    const { email } = body ?? {};

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email wajib diisi" }, { status: 400 });
    }

    const user = await prisma.pengguna.findUnique({ where: { email } });
    if (!user) {
      // Return success even if user not found (security best practice)
      return NextResponse.json(
        {
          message:
            "Jika email terdaftar, link reset akan dikirim (user gk ada)",
        },
        { status: 200 },
      );
    }

    // Hapus token lama yang masih digunakan
    await prisma.resetKataSandi.deleteMany({ where: { penggunaId: user.id } });

    // Generate token
    const token = crypto.randomBytes(32).toString("hex");

    // Simpan token di database dengan expiry 1 hari
    await prisma.resetKataSandi.create({
      data: {
        penggunaId: user.id,
        token,
        kedaluwarsaPada: new Date(
          Date.now() + RESET_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000,
        ),
      },
    });

    // TODO: Kirim email ke user dengan link reset
    // Contoh: await sendEmail(user.email, "Reset Password", `<a href="${process.env.NEXT_PUBLIC_URL}/auth/reset-password?token=${token}">Reset Password</a>`)
    console.log(`Reset token for ${user.email}: ${token}`);
    console.log("Email delivery hook - would send reset link here");

    return NextResponse.json(
      { message: "Jika email terdaftar, link reset akan dikirim", token },
      { status: 200 },
    );
  } catch (err) {
    return NextResponse.json(
      { error: "Gagal memproses permintaan reset" },
      { status: 500 },
    );
  }
}
