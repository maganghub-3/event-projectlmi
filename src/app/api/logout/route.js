import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/authMiddleware";

export async function POST(request) {
  const { user, response } = requireAuth(request);
  if (response) return response;

  const res = NextResponse.json({
    message: "Logout berhasil",
    id: user.id,
    email: user.email,
  });
  res.cookies.set("token", "", { path: "/", maxAge: 0 });
  return res;
}
