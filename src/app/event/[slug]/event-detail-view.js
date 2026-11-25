"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Icon from "@/app/landing/Icon";
import notify from "@/lib/sweetalert";
import { availableTickets } from "@/lib/booking-store";
import { INITIAL_EVENTS } from "@/app/landing/data";
import { BRAND } from "@/constants/brand";

const MONTH_NAMES = {
  JAN: "Januari",
  FEB: "Februari",
  MAR: "Maret",
  APR: "April",
  MEI: "Mei",
  JUN: "Juni",
  JUL: "Juli",
  AGU: "Agustus",
  SEP: "September",
  OKT: "Oktober",
  NOV: "November",
  DES: "Desember",
};

function formatRupiah(value) {
  return `Rp ${value.toLocaleString("id-ID")}`;
}

export default function EventDetailView({ event }) {
  const [mapKey, setMapKey] = useState(0);
  const [activeTab, setActiveTab] = useState("deskripsi");
  const [available, setAvailable] = useState(event.spotsLeft);

  useEffect(() => {
    Promise.resolve().then(() => setAvailable(availableTickets(event)));
  }, [event]);

  const { lat, lng } = event.location;
  const coordinates = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat}%2C${lng}`;
  const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat}%2C${lng}`;
  const googleMapsEmbedUrl = `https://www.google.com/maps?q=${lat}%2C${lng}&z=16&output=embed&hl=id`;

  const relatedEvents = INITIAL_EVENTS.filter((item) => item.id !== event.id).slice(0, 3);
  const formattedDate = `${event.day} ${MONTH_NAMES[event.month] || event.month} ${event.year}`;
  const startingPrice = Math.min(...event.ticketTypes.map((type) => type.price));

  const handleCopyCoordinates = async () => {
    const text = `${lat}, ${lng}`;

    const legacyCopy = () => {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      const copied = document.execCommand("copy");
      document.body.removeChild(textarea);
      return copied;
    };

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else if (!legacyCopy()) {
        throw new Error("copy unavailable");
      }
      notify.toast("Koordinat lokasi berhasil disalin.");
    } catch {
      if (legacyCopy()) {
        notify.toast("Koordinat lokasi berhasil disalin.");
      } else {
        notify.error(
          "Browser tidak mengizinkan penyalinan otomatis. Salin manual dari teks koordinat."
        );
      }
    }
  };

  return (
    <main className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8 pb-16">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <Link href="/" className="hover:text-brand-700 transition">
          Beranda
        </Link>
        <span className="text-slate-300">/</span>
        <Link
          href={`/sub-kategori?c=${event.categoryKey}`}
          className="hover:text-brand-700 transition"
        >
          {event.category}
        </Link>
        <span className="text-slate-300">/</span>
        <span className="truncate max-w-[220px] text-slate-700">{event.title}</span>
      </nav>

      {/* Hero image */}
      <div className="relative mt-4 aspect-[16/9] sm:aspect-[21/8] overflow-hidden rounded-3xl bg-slate-200">
        <Image
          src={event.image}
          alt={event.alt}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 1152px"
          className="object-cover"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/10 to-transparent" />

        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <span
            className={`rounded-full border px-3 py-1 text-[11px] font-bold shadow-sm ${event.categoryColor}`}
          >
            {event.category}
          </span>
          <span className="rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold text-brand-700 shadow-sm backdrop-blur">
            {event.badge}
          </span>
        </div>

        <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-semibold text-white">
          <span className="inline-flex items-center gap-1.5">
            <Icon name="calendar" className="h-4 w-4" />
            {formattedDate}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Icon name="clock" className="h-4 w-4" />
            {event.time}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Icon name="mapPin" className="h-4 w-4" />
            {event.venue}, {event.city}
          </span>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:items-start">
        {/* Kolom utama */}
        <div className="lg:col-span-8 space-y-6">
          <header>
            <p className="text-xs font-bold uppercase tracking-wider text-brand-600">
              {event.category} • oleh {event.host}
            </p>
            <h1 className="mt-1.5 text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-900 leading-tight">
              {event.title}
            </h1>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="flex items-start gap-3 rounded-2xl border border-slate-200/80 bg-white p-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <Icon name="calendar" className="h-4.5 w-4.5" />
                </span>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Tanggal
                  </p>
                  <p className="mt-0.5 text-sm font-extrabold text-slate-900">{formattedDate}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl border border-slate-200/80 bg-white p-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <Icon name="clock" className="h-4.5 w-4.5" />
                </span>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Waktu
                  </p>
                  <p className="mt-0.5 text-sm font-extrabold text-slate-900">{event.time}</p>
                </div>
              </div>

              <a
                href="#lokasi"
                className="group flex items-start gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 transition hover:border-brand-300"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <Icon name="mapPin" className="h-4.5 w-4.5" />
                </span>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Lokasi
                  </p>
                  <p className="mt-0.5 truncate text-sm font-extrabold text-slate-900 group-hover:text-brand-700">
                    {event.venue}
                  </p>
                  <p className="truncate text-xs text-slate-500">{event.city}</p>
                </div>
              </a>

              <div className="flex items-start gap-3 rounded-2xl border border-slate-200/80 bg-white p-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                  <Icon name="ticket" className="h-4.5 w-4.5" />
                </span>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Ketersediaan
                  </p>
                  <p className="mt-0.5 text-sm font-extrabold text-slate-900">
                    {available} tiket tersisa
                  </p>
                </div>
              </div>
            </div>
          </header>

          {/* Tentang event */}
          {/* Deskripsi & Syarat Ketentuan (tab) */}
          <section className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-7">
            <div className="border-b border-slate-200">
              <div className="flex gap-6">
                {[
                  { id: "deskripsi", label: "Deskripsi" },
                  { id: "syarat", label: "Syarat & Ketentuan" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative pb-3 text-sm font-bold transition ${
                      activeTab === tab.id
                        ? "text-brand-700"
                        : "text-slate-400 hover:text-slate-700"
                    }`}
                  >
                    {tab.label}
                    {activeTab === tab.id && (
                      <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-brand-600" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {activeTab === "deskripsi" ? (
              <div className="pt-5">
                <h2 className="text-lg font-extrabold text-slate-900">Deskripsi</h2>
                <div className="mt-2 space-y-4 text-sm leading-relaxed text-slate-600">
                  {event.description.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>

                <h3 className="mt-6 text-sm font-extrabold text-slate-900">
                  Yang kamu dapatkan
                </h3>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {event.highlights.map((highlight) => (
                    <div
                      key={highlight}
                      className="flex items-start gap-2.5 rounded-2xl border border-brand-100 bg-brand-50/60 px-3.5 py-3"
                    >
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white">
                        <Icon name="check" className="h-3 w-3" />
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-slate-700 leading-relaxed">
                        {highlight}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="pt-5">
                <h2 className="text-lg font-extrabold text-slate-900">
                  Syarat &amp; Ketentuan
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Harap dibaca sebelum membeli tiket.
                </p>
                <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm leading-relaxed text-slate-600 marker:font-bold marker:text-brand-700">
                  {event.terms.map((term) => (
                    <li key={term} className="pl-1">
                      {term}
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </section>

          {/* Lokasi & peta */}
          <section
            id="lokasi"
            className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-7 scroll-mt-24"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900">Lokasi &amp; Peta</h2>
                <p className="mt-1 text-sm font-bold text-slate-800">{event.venue}</p>
                <p className="mt-0.5 text-xs text-slate-500 leading-relaxed">{event.address}</p>
              </div>
              
            </div>

            <div className="relative mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
              <iframe
                key={mapKey}
                title={`Peta lokasi ${event.venue} di Google Maps`}
                src={googleMapsEmbedUrl}
                className="h-[300px] w-full border-0 sm:h-[340px]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />

              
            </div>

            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <Icon name="mapPin" className="h-4 w-4 text-brand-600" />
                <span className="font-bold text-slate-700">Koordinat GPS:</span>
                <span className="rounded-lg bg-slate-100 px-2 py-1 font-mono text-[11px] text-slate-700">
                  {coordinates}
                </span>
                <button
                  type="button"
                  onClick={handleCopyCoordinates}
                  aria-label="Salin koordinat GPS"
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 font-bold text-slate-600 transition hover:border-brand-300 hover:text-brand-700"
                >
                  <Icon name="link" className="h-3 w-3" />
                  Salin
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setMapKey((key) => key + 1)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-sm transition hover:border-brand-300 hover:text-brand-700 active:scale-95"
                >
                  <Icon name="mapPin" className="h-4 w-4 text-brand-600" />
                  Kembali ke lokasi
                </button>

                <a
                  href={googleMapsDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-xs font-extrabold text-white shadow-md shadow-brand-600/20 transition hover:bg-brand-700 active:scale-95"
                >
                  <Icon name="mapPin" className="h-4 w-4" />
                  Petunjuk Arah
                </a>
              </div>
            </div>

            <p className="mt-3 text-[10px] text-slate-400">
              Titik peta mengikuti koordinat GPS venue. Peta disediakan oleh Google Maps.
            </p>
          </section>

        </div>

        {/* Kolom pemesanan */}
        <aside className="lg:col-span-4">
          <div className="lg:sticky lg:top-24 space-y-4">
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-lg shadow-slate-900/5">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Mulai dari
              </span>
              <p className="mt-1 text-3xl font-black text-slate-900">
                {formatRupiah(startingPrice)}
              </p>
              <p className="mt-1 text-xs text-slate-500">per orang, harga Early Bird</p>

              <div className="mt-4 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-bold text-amber-700">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                Sisa {available} tiket
              </div>

              <div className="mt-4 rounded-2xl border border-brand-200 bg-brand-50/70 p-4">
                <p className="text-xs font-bold text-slate-800">Beberapa pilihan tiket tersedia</p>
                <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500">
                  Early Bird, Reguler, dan Bundling. Pilih kategori untuk melihat harga &amp; kuota.
                </p>
              </div>

              <Link
                href={`/event/${event.slug}/tiket`}
                className={`mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-brand-600 to-brand-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-600/25 transition hover:from-brand-700 hover:to-brand-600 active:scale-95 ${
                  available === 0 ? "pointer-events-none cursor-not-allowed opacity-50" : ""
                }`}
              >
                {available === 0 ? "Tiket Habis" : "Pilih Kategori Tiket"}
                <Icon name="arrowRight" className="h-4 w-4" />
              </Link>

              <ul className="mt-4 space-y-2 text-[11px] font-semibold text-slate-500">
                <li className="flex items-center gap-2">
                  <Icon name="shield" className="h-4 w-4 text-emerald-500" />
                  Garansi 100% tiket resmi
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="ticket" className="h-4 w-4 text-emerald-500" />
                  E-ticket dikirim instan
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="creditCard" className="h-4 w-4 text-emerald-500" />
                  Pembayaran terenkripsi 256-bit
                </li>
              </ul>
            </div>

            {/* Penyelenggara + media sosial */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Diselenggarakan oleh
              </p>

              <div className="mt-3 flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white">
                  <Image
                    src={event.organizer.logo}
                    alt={`Logo ${event.organizer.name}`}
                    width={48}
                    height={48}
                    className="h-12 w-12 object-contain"
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-extrabold text-slate-900">
                    {event.organizer.name}
                  </h3>
                  <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500">
                    {event.organizer.tagline}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
                {event.organizer.socials.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${social.name} ${event.organizer.name}`}
                    title={social.name}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
                  >
                    <Icon name={social.icon} className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-5">
              <p className="text-sm font-bold text-slate-900">Ada pertanyaan soal event ini?</p>
              <p className="mt-1 text-xs text-slate-500">
                Tim {BRAND.name} siap membantu sebelum kamu membeli tiket.
              </p>
              <Link
                href="/hubungi-kami"
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-extrabold text-brand-700 hover:underline"
              >
                Hubungi Kami
                <Icon name="arrowRight" className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </aside>
      </div>

      {/* Event terkait */}
      <section className="mt-12">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Event Lain yang Mungkin Kamu Suka
          </h2>
          <Link
            href="/#event"
            className="shrink-0 text-xs font-bold text-brand-700 hover:underline"
          >
            Lihat semua
          </Link>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {relatedEvents.map((item) => (
            <Link
              key={item.id}
              href={`/event/${item.slug}`}
              className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white transition hover:border-brand-300 hover:shadow-lg"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span
                  className={`absolute left-3 top-3 rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${item.categoryColor}`}
                >
                  {item.category}
                </span>
              </div>
              <div className="p-4">
                <p className="text-[11px] font-bold text-brand-600">
                  {item.day} {MONTH_NAMES[item.month] || item.month} {item.year} • {item.city}
                </p>
                <h3 className="mt-1 text-sm font-extrabold leading-snug text-slate-900 group-hover:text-brand-700">
                  {item.title}
                </h3>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                  <Icon name="mapPin" className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                  <span className="truncate">{item.venue}</span>
                </p>
                <p className="mt-2 text-sm font-black text-slate-900">
                  {formatRupiah(item.price)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
