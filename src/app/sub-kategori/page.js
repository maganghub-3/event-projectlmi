import { CATEGORIES, INITIAL_EVENTS } from "../landing/data";
import SubKategoriEvents from "./sub-kategori-events";
import Navbar from "../landing/Navbar";

const CATEGORY_ICONS = {
  all: "sparkles",
  musik: "music",
  festival: "ticket",
  workshop: "sparkles",
  seni: "star",
  olahraga: "trendingUp",
};
import Icon from "../landing/Icon";
import Link from "next/link";

/**
 * Halaman sub kategori — Server Component.
 *
 * Header (back link, ikon, nama kategori, jumlah event) dirender di server,
 * sehingga header selalu ada di HTML awal — tanpa perlu useSearchParams.
 *
 * URL: /sub-kategori?c=<id>
 * Contoh: /sub-kategori?c=musik
 * Tanpa param (atau c=all) = daftar semua kategori.
 */

/**
 * Route ini memakai `searchParams` (runtime data) sebelum render,
 * jadi `instant = false` dipakai agar route diizinkan blocking —
 * header ikut ada di HTML awal.
 */
export const instant = false;

export default async function Page({ searchParams }) {
  const params = (await searchParams) || {};
  const catId = params.c || "all";
  const cat = CATEGORIES.find((c) => c.id === catId) || CATEGORIES[0];

  const eventsInCat =
    cat.id === "all"
      ? INITIAL_EVENTS
      : INITIAL_EVENTS.filter((e) => e.categoryKey === cat.id);

  return (
    <div className="min-h-screen bg-[#F7F8FC] text-slate-800 flex flex-col font-sans selection:bg-brand-200 selection:text-brand-900">
      {/* Navbar & Promo Header */}
      <Navbar />

      {/* Header halaman sub kategori (server-rendered) */}
      <header className="pt-8 pb-7 px-4 sm:px-6 max-w-6xl mx-auto border-b border-slate-200/60 w-full">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-brand-600 hover:text-brand-700 font-bold text-sm transition"
        >
          <Icon name="arrowLeft" className="w-5 h-5" />
          Beranda
        </Link>

        <div className="flex items-center gap-3 mt-3.5">
          <span className="shrink-0"><Icon name={CATEGORY_ICONS[cat.id] || "sparkles"} className="h-8 w-8" /></span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {cat.name}
          </h1>
        </div>

        <p className="text-sm text-slate-500 mt-1.5">
          {eventsInCat.length} event tersedia
        </p>
      </header>

      {/* Daftar event (Client Component) */}
      <main className="w-full pb-16">
        <SubKategoriEvents catId={cat.id} />
      </main>
    </div>
  );
}
