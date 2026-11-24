import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/authMiddleware";

// helper function
const VISIBILITAS = ["PUBLIK", "PRIVAT"];
const STATUS = ["DRAFT", "PUBLISH"];
const STRING_FIELDS = [
  "nama",
  "poster",
  "lokasi",
  "kota",
  "deskripsi",
  "syaratKetentuan",
];

function badRequest(error) {
  return NextResponse.json({ error }, { status: 400 });
}

function validateBody(body) {
  const data = {};
  for (const field of [
    ...STRING_FIELDS,
    "mulaiPada",
    "selesaiPada",
    "visibilitas",
    "status",
  ]) {
    if (body[field] !== undefined) data[field] = body[field];
  }
  if (Object.keys(data).length === 0)
    return { error: "Tidak ada data yang diperbarui" };

  for (const field of STRING_FIELDS) {
    if (!(field in data)) continue;
    const value = data[field];
    if (field === "nama") {
      if (typeof value !== "string" || !value.trim())
        return { error: "nama wajib berupa teks" };
      data.nama = value.trim();
    } else if (value !== null && typeof value !== "string") {
      return { error: `${field} harus berupa teks atau null` };
    }
  }

  for (const field of ["mulaiPada", "selesaiPada"]) {
    if (!(field in data)) continue;
    if (field === "selesaiPada" && data[field] === null) continue;
    const date = new Date(data[field]);
    if (data[field] == null || Number.isNaN(date.getTime()))
      return { error: `${field} tidak valid` };
    data[field] = date;
  }

  if ("visibilitas" in data && !VISIBILITAS.includes(data.visibilitas))
    return { error: "visibilitas tidak valid" };
  if ("status" in data && !STATUS.includes(data.status))
    return { error: "status tidak valid" };

  return { data };
}

//Endpoint
export async function GET(request, context) {
  try {
    const { id } = await context.params;
    const event = await prisma.event.findUnique({
      where: { id: Number(id) },
    });
    if (!event) {
      return NextResponse.json(
        { error: "Event tidak ditemukan" },
        { status: 404 },
      );
    }
    return NextResponse.json(event);
  } catch (err) {
    return NextResponse.json(
      { error: "Gagal mengambil event" },
      { status: 500 },
    );
  }
}

export async function PUT(request, context) {
  const { user, response } = requireRole(request, "ADMIN_EVENT");
  if (response) return response;

  const eventId = Number((await context.params).id);
  if (!Number.isInteger(eventId) || eventId <= 0) {
    return badRequest("ID event tidak valid");
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") return badRequest("Body tidak valid");

  const { data, error } = validateBody(body);
  if (error) return badRequest(error);

  try {
    const pengguna = await prisma.pengguna.findUnique({
      where: { id: user.id },
      select: { penyelenggaraId: true },
    });
    if (!pengguna?.penyelenggaraId) {
      return badRequest("Akun admin belum terhubung ke penyelenggara");
    }

    const existing = await prisma.event.findUnique({
      where: { id: eventId },
      select: { penyelenggaraId: true, mulaiPada: true, selesaiPada: true },
    });
    if (!existing) {
      return NextResponse.json(
        { error: "Event tidak ditemukan" },
        { status: 404 },
      );
    }
    if (existing.penyelenggaraId !== pengguna.penyelenggaraId) {
      return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
    }

    const mulaiPada = data.mulaiPada ?? existing.mulaiPada;
    const selesaiPada =
      "selesaiPada" in data ? data.selesaiPada : existing.selesaiPada;
    if (selesaiPada && selesaiPada < mulaiPada) {
      return badRequest("selesaiPada harus setelah atau sama dengan mulaiPada");
    }

    const event = await prisma.event.update({
      where: { id: eventId },
      data,
    });
    return NextResponse.json(event);
  } catch (err) {
    return NextResponse.json(
      { error: "Gagal memperbarui event" },
      { status: 500 },
    );
  }
}

export const PATCH = PUT;
