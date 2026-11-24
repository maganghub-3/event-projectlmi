import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/authMiddleware";

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
