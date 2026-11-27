"use client";

import { useEffect, useSyncExternalStore } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getHomePath } from "@/lib/auth-utils";
import {
  getSession,
  getSessionSnapshot,
  hasRole,
  subscribeSession,
} from "@/lib/session";

// Snapshot server selalu null agar HTML awal (skeleton) sama dengan hasil
// hidrasi; React akan menyinkronkan snapshot asli setelah hidrasi selesai.
const getServerSnapshot = () => null;

// Menjaga halaman dashboard: wajib punya sesi dan (opsional) role tertentu.
// Mengembalikan { user, loading } — render konten hanya saat loading selesai.
export function useRequireRole(roles) {
  const router = useRouter();
  const pathname = usePathname();
  const session = useSyncExternalStore(
    subscribeSession,
    getSessionSnapshot,
    getServerSnapshot
  );

  const roleKey = Array.isArray(roles) ? roles.join(",") : String(roles ?? "");
  const authorized =
    Boolean(session) &&
    (!roleKey || hasRole(session, roleKey.split(",")));

  useEffect(() => {
    // Baca langsung dari storage: pada load pertama (reload) snapshot React
    // masih null, jadi jangan sampai salah me-redirect ke halaman login.
    const current = getSession();

    if (!current) {
      const redirect = pathname
        ? `?redirect=${encodeURIComponent(pathname)}`
        : "";
      router.replace(`/authentication/login${redirect}`);
      return;
    }

    const allowed = roleKey ? roleKey.split(",") : [];
    if (allowed.length > 0 && !hasRole(current, allowed)) {
      router.replace(getHomePath(current));
    }
  }, [pathname, roleKey, router, session]);

  return { user: authorized ? session : null, loading: !authorized };
}
