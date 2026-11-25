import { NextResponse } from "next/server";
import { verifyToken } from "./auth";

export function getAuthUser(request) {
  const header = request.headers.get("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  return verifyToken(token);
}

export function requireAuth(request) {
  const user = getAuthUser(request);
  if (!user) {
    return { user: null, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return { user, response: null };
}

export function requireRole(request, roles) {
  const { user, response } = requireAuth(request);
  if (response) return { user: null, response };
  const allowed = Array.isArray(roles) ? roles : [roles];
  if (!allowed.includes(user.peran)) {
    return {
      user: null,
      response: NextResponse.json({ error: "Akses ditolak" }, { status: 403 }),
    };
  }
  return { user, response: null };
}
