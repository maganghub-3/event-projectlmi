import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/authMiddleware";

const STRING_FIELDS = [
  "nama",
  "logo",
  "deskripsi",
  "emailKontak",
  "teleponKontak",
];

function badRequest(error) {
  return NextResponse.json({ error }, { status: 400 });
}

function validateBody(body) {
  const data = {};
  for (const field of [...STRING_FIELDS, "status"]) {
    if (body[field] !== undefined) data[field] = body[field];
  }
  if (Object.keys(data).length === 0)
    return { error: "Tidak ada data yang diperbarui" };

  for (const field of STRING_FIELDS) {
    if (!(field in data)) continue;
    const value = data[field];
    if (field === "nama") {
      if (typeof value !== "string" || value.trim().length < 3)
        return { error: "nama wajib diisi minimal 3 karakter" };
      data.nama = value.trim();
    } else if (value !== null && typeof value !== "string") {
      return { error: `${field} harus berupa teks atau null` };
    }
  }

  if ("emailKontak" in data && data.emailKontak != null) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.emailKontak))
      return { error: "Format emailKontak tidak valid" };
  }

  if ("status" in data && !["AKTIF", "NONAKTIF"].includes(data.status))
    return { error: "status harus AKTIF atau NONAKTIF" };

  return { data };
}

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

export async function PUT(request, context) {
  const { user, response } = requireRole(request, [
    "SUPER_ADMIN",
    "ADMIN_EVENT",
  ]);
  if (response) return response;

  const penyelenggaraId = Number((await context.params).id);
  if (!Number.isInteger(penyelenggaraId) || penyelenggaraId <= 0) {
    return badRequest("ID penyelenggara tidak valid");
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") return badRequest("Body tidak valid");

  const { data, error } = validateBody(body);
  if (error) return badRequest(error);

  try {
    const existing = await prisma.penyelenggara.findUnique({
      where: { id: penyelenggaraId },
      select: { id: true },
    });
    if (!existing) {
      return NextResponse.json(
        { error: "Penyelenggara tidak ditemukan" },
        { status: 404 },
      );
    }

    if (user.peran === "SUPER_ADMIN") {
      if (!data.status || (data.status && Object.keys(data).length > 1)) {
        return badRequest(
          "SUPER_ADMIN Tidak bisa mengubah profil penyelenggara",
        );
      }
      const penyelenggara = await prisma.penyelenggara.update({
        where: { id: penyelenggaraId },
        data,
      });
      return NextResponse.json(penyelenggara);
    }

    if (user.peran === "ADMIN_EVENT") {
      const pengguna = await prisma.pengguna.findUnique({
        where: { id: user.id },
        select: { penyelenggaraId: true },
      });
      if (!pengguna?.penyelenggaraId) {
        return badRequest("Akun admin belum terhubung ke penyelenggara");
      }
      if (pengguna.penyelenggaraId !== penyelenggaraId) {
        return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
      }
      const penyelenggara = await prisma.penyelenggara.update({
        where: { id: penyelenggaraId },
        data,
      });

      return NextResponse.json(penyelenggara);
    }
  } catch (err) {
    return NextResponse.json(
      { error: "Gagal memperbarui penyelenggara" },
      { status: 500 },
    );
  }
}

export const PATCH = PUT;
