import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, hashPassword } from "@/lib/auth";

export async function POST(request) {
  try {
    const body = await request.json();
    const { token, password } = body ?? {};

    if (!token || typeof token !== "string") {
      return NextResponse.json(
        { error: "Token wajib diisi" },
        { status: 400 },
      );
    }

    if (!password || typeof password !== "string" || password.length < 6) {
      return NextResponse.json(
        { error: "Password minimal 6 karakter" },
        { status: 400 },
      );
    }

    // Cari token di database
    const resetRecord = await prisma.resetKataSandi.findUnique({
      where: { token },
      include: { pengguna: true },
    });

    if (!resetRecord) {
      return NextResponse.json(
        { error: "Token tidak valid atau telah digunakan" },
        { status: 400 },
      );
    }

    // Cek expiry
    if (new Date() > resetRecord.kedaluwarsaPada) {
      // Hapus token kadaluarsa
      await prisma.resetKataSandi.delete({ where: { id: resetRecord.id } });
      return NextResponse.json(
        { error: "Token telah kadaluarsa" },
        { status: 400 },
      );
    }

    // Pastikan token masih digunakan sekali saja (cek jika sudah pernah digunakan)
    if (resetRecord.digunakanPada) {
      return NextResponse.json(
        { error: "Token telah digunakan sebelumnya" },
        { status: 400 },
      );
    }

    // Hash password baru
    const kataSandiHash = hashPassword(password);

    // Update password pengguna dan tandai token sebagai digunakan
    await prisma.$transaction([
      prisma.pengguna.update({
        where: { id: resetRecord.penggunaId },
        data: { kataSandiHash },
      }),
      prisma.resetKataSandi.update({
        where: { id: resetRecord.id },
        data: { digunakanPada: new Date() },
      }),
    ]);

    return NextResponse.json(
      { message: "Password berhasil diubah" },
      { status: 200 },
    );
  } catch (err) {
    return NextResponse.json(
      { error: "Gagal mereset password" },
      { status: 500 },
    );
  }
}