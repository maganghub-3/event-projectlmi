"use client";

/* eslint-disable @next/next/no-img-element */

import { useSyncExternalStore } from "react";
import Link from "next/link";
import Icon from "@/app/landing/Icon";
import Button from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/app/landing/Navbar";
import {
  EO_EVENTS,
  formatRupiah,
  getOrganizationServerSnapshot,
  getOrganizationSnapshot,
  getProfileStatus,
  subscribeProfiles,
} from "@/app/dashboard-eo/_data/eo-dashboard-data";

function slugify(text = "") {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

const CATEGORY_KEYS = {
  "Musik & Konser": "musik",
  "Festival & Kuliner": "festival",
  "Workshop & Kelas": "workshop",
};

export default function OrganizerProfile({ slug }) {
  const pen1 = useSyncExternalStore(
    subscribeProfiles,
    () => getOrganizationSnapshot("pen-1"),
    () => getOrganizationServerSnapshot("pen-1")
  );
  const pen2 = useSyncExternalStore(
    subscribeProfiles,
    () => getOrganizationSnapshot("pen-2"),
    () => getOrganizationServerSnapshot("pen-2")
  );

  const matched = [
    { id: "pen-1", profile: pen1 },
    { id: "pen-2", profile: pen2 },
  ].find(
    (entry) =>
      entry.id === slug || slugify(entry.profile?.name || "") === slug
  );

  if (!matched) {
    return (
      <div className="min-h-screen bg-[#F7F8FC] flex flex-col">
        <Navbar />
        <main className="mx-auto w-full max-w-3xl px-4 py-20 text-center">
          <h1 className="text-2xl font-black text-slate-900">Penyelenggara tidak ditemukan</h1>
          <p className="mt-2 text-sm text-slate-500">
            Profil penyelenggara yang Anda cari belum tersedia.
          </p>
          <Button href="/" variant="primary" rounded="xl" className="mt-6">
            Kembali ke beranda
          </Button>
        </main>
      </div>
    );
  }

  const { id, profile } = matched;
  const events = EO_EVENTS.filter((event) => event.penyelenggaraId === id);
  const status = getProfileStatus(profile);
  const socials = [
    ["instagram", `https://instagram.com/${String(profile.socials?.instagram || "").replace(/^@/, "")}`],
    ["tiktok", `https://tiktok.com/${String(profile.socials?.tiktok || "").replace(/^@/, "")}`],
    ["website", profile.socials?.website],
  ].filter(([, url]) => url);

  return (
    <div className="min-h-screen bg-[#F7F8FC] text-slate-800 flex flex-col font-sans">
      <Navbar />

      <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
        <section className="flex flex-col gap-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:p-8">
          <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 sm:h-36 sm:w-36">
            {profile.logoData || profile.logo ? (
              <img
                src={profile.logoData || profile.logo}
                alt={`Logo ${profile.name}`}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-slate-400">
                <Icon name="building" className="h-10 w-10" />
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                {profile.name}
              </h1>
              <Badge variant={status === "Terverifikasi" ? "success" : "warning"}>
                {status}
              </Badge>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              {profile.description || "Penyelenggara event mitra LMI Event."}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-500">
              {socials.map(([label, url]) => (
                <a
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 font-bold capitalize transition hover:bg-brand-50 hover:text-brand-700"
                >
                  <Icon name={label === "website" ? "globe" : label} className="h-3.5 w-3.5" />
                  {label}
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-brand-700">
                Katalog Penyelenggara
              </span>
              <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-900">
                Acara dari {profile.name}
              </h2>
            </div>
            <span className="text-xs text-slate-500">{events.length} acara</span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {events.map((event) => (
              <Link
                key={event.id}
                href={`/sub-kategori?c=${CATEGORY_KEYS[event.category] || "all"}`}
                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-brand-300 hover:shadow-md"
              >
                <span className="text-[11px] font-bold uppercase tracking-wider text-brand-700">
                  {event.category}
                </span>
                <h3 className="mt-1 text-base font-extrabold text-slate-900">{event.title}</h3>
                <p className="mt-1 text-xs text-slate-500">
                  {event.date} • {event.venue}, {event.city}
                </p>
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                  <span className="font-bold text-brand-700">{formatRupiah(event.price)}</span>
                  <span className="text-slate-400">{event.sold} tiket terjual</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <footer className="mt-auto border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-400">
        Profil ini ditampilkan dari data contoh penyelenggara.
      </footer>
    </div>
  );
}
