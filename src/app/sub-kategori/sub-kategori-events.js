"use client";

import { useRouter } from "next/navigation";
import EventSection from "../landing/event";

/**
 * Daftar event halaman sub kategori (Client Component).
 *
 * Memakai router.push untuk "Reset Semua Filter" — sebisa mungkin karena
 * event list sendiri sudah di-server-render di page.js.
 */
export default function SubKategoriEvents({ catId }) {
  const router = useRouter();

  return (
    <EventSection
      activeCategory={catId}
      onResetFilters={() => router.push("/sub-kategori?c=all")}
    />
  );
}
