"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Icon from "@/app/landing/Icon";
import notify from "@/lib/sweetalert";
import BookingSteps from "@/components/booking/booking-steps";
import { availableTickets, createDraft } from "@/lib/booking-store";

const MONTH_NAMES = {
  JAN: "Januari", FEB: "Februari", MAR: "Maret", APR: "April",
  MEI: "Mei", JUN: "Juni", JUL: "Juli", AGU: "Agustus",
  SEP: "September", OKT: "Oktober", NOV: "November", DES: "Desember",
};

const MAX_PACKAGES = 5;

function formatRupiah(value) {
  return `Rp ${value.toLocaleString("id-ID")}`;
}

export default function TicketTypesView({ event }) {
  const router = useRouter();
  const [selectedTypeId, setSelectedTypeId] = useState("reguler");
  const [qty, setQty] = useState(1);
  const [available, setAvailable] = useState(event.spotsLeft);

  useEffect(() => {
    Promise.resolve().then(() => setAvailable(availableTickets(event)));
  }, [event]);

  const selectedType = event.ticketTypes.find((type) => type.id === selectedTypeId) || event.ticketTypes[0];
  const maxQty = Math.max(0, Math.min(MAX_PACKAGES, Math.floor(available / selectedType.ticketCount)));
  const total = selectedType.price * qty;
  const totalTickets = selectedType.ticketCount * qty;
  const formattedDate = `${event.day} ${MONTH_NAMES[event.month] || event.month} ${event.year}`;

  const handleContinue = () => {
    if (qty > maxQty) {
      notify.error(`Maaf, tersedia ${available} tiket untuk event ini.`);
      return;
    }
    createDraft(event, qty, selectedType);
    router.push("/checkout/pemesan");
  };

  return (
    <main className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-8 pb-16">
      {/* Back & tahap */}
      <Link
        href={`/event/${event.slug}`}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 hover:underline"
      >
        <Icon name="arrowLeft" className="h-4 w-4" />
        Kembali ke Detail Event
      </Link>

      <div className="mt-4">
        <BookingSteps current={1} />
      </div>

      {/* Ringkasan event */}
      <div className="mt-6 flex items-center gap-4 rounded-3xl border border-slate-200/80 bg-white p-4 sm:p-5">
        <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-2xl bg-slate-100">
          <Image src={event.image} alt={event.alt} fill sizes="112px" className="object-cover" />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-wider text-brand-600">
            Pilih kategori tiketmu
          </p>
          <h1 className="mt-0.5 truncate text-lg font-black text-slate-900 sm:text-xl">
            {event.title}
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            {formattedDate} • {event.time} • {event.venue}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-12 lg:items-start">
        {/* Daftar kategori tiket */}
        <section className="space-y-3 lg:col-span-8">
          <div className="flex items-end justify-between gap-3">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">Kategori Tiket</h2>
              <p className="text-xs text-slate-500">Sisa {available} tiket tersedia.</p>
            </div>
            <span className="shrink-0 rounded-full bg-brand-50 px-3 py-1 text-[11px] font-bold text-brand-700 ring-1 ring-brand-200">
              Pilih satu
            </span>
          </div>

          {event.ticketTypes.map((type) => {
            const isSelected = type.id === selectedTypeId;
            const soldOut = available < type.ticketCount;

            return (
              <label
                key={type.id}
                className={`block cursor-pointer rounded-3xl border bg-white p-5 transition sm:p-6 ${
                  isSelected
                    ? "border-brand-400 ring-2 ring-brand-100 shadow-md"
                    : "border-slate-200/80 hover:border-brand-200"
                } ${soldOut ? "opacity-60" : ""}`}
              >
                <input
                  type="radio"
                  name="ticketType"
                  value={type.id}
                  checked={isSelected}
                  disabled={soldOut}
                  onChange={() => {
                    setSelectedTypeId(type.id);
                    setQty(1);
                  }}
                  className="sr-only"
                />

                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                        isSelected ? "border-brand-600 bg-brand-600 text-white" : "border-slate-300"
                      }`}
                    >
                      {isSelected && <Icon name="check" className="h-3 w-3" />}
                    </span>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-extrabold text-slate-900">{type.name}</h3>
                        <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-extrabold text-amber-700 ring-1 ring-amber-200">
                          {type.badge}
                        </span>
                        {type.ticketCount > 1 && (
                          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-extrabold text-emerald-700 ring-1 ring-emerald-200">
                            {type.ticketCount} tiket
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-slate-500">{type.desc}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    {type.originalPrice && (
                      <p className="text-xs text-slate-400 line-through">
                        {formatRupiah(type.originalPrice)}
                      </p>
                    )}
                    <p className="text-xl font-black text-brand-700">{formatRupiah(type.price)}</p>
                    <p className="text-[10px] text-slate-400">
                      {type.ticketCount > 1 ? "untuk 2 orang" : "per orang"}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 border-t border-slate-100 pt-3">
                  {type.perks.map((perk) => (
                    <span key={perk} className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-600">
                      <Icon name="check" className="h-3.5 w-3.5 text-emerald-500" />
                      {perk}
                    </span>
                  ))}
                  {type.quota && (
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-700">
                      <Icon name="alert" className="h-3.5 w-3.5" />
                      Kuota {type.quota} paket
                    </span>
                  )}
                </div>
              </label>
            );
          })}
        </section>

        {/* Ringkasan & lanjut */}
        <aside className="lg:col-span-4">
          <div className="lg:sticky lg:top-24 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-extrabold text-slate-900">Ringkasan Pesanan</h2>

            <div className="mt-4 rounded-2xl bg-brand-50/60 p-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-brand-600">
                Kategori dipilih
              </p>
              <p className="mt-0.5 text-sm font-extrabold text-slate-900">{selectedType.name}</p>
              <p className="mt-0.5 text-xs text-slate-500">
                {selectedType.ticketCount > 1
                  ? `${selectedType.ticketCount} tiket per paket`
                  : "1 tiket per paket"}
              </p>
            </div>

            <div className="mt-4 flex items-center justify-between rounded-2xl border border-slate-200 p-3.5">
              <div>
                <span className="block text-xs font-bold text-slate-800">Jumlah Paket</span>
                <span className="text-[11px] text-slate-500">Maksimal {MAX_PACKAGES} paket</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setQty((value) => Math.max(1, value - 1))}
                  aria-label="Kurangi jumlah paket"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 bg-white font-bold text-slate-700 transition hover:bg-slate-100"
                >
                  -
                </button>
                <span className="w-4 text-center text-base font-extrabold text-slate-900">{qty}</span>
                <button
                  type="button"
                  onClick={() => setQty((value) => Math.min(maxQty, value + 1))}
                  disabled={qty >= maxQty}
                  aria-label="Tambah jumlah paket"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 bg-white font-bold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  +
                </button>
              </div>
            </div>

            <div className="mt-4 flex items-end justify-between border-t border-slate-100 pt-4">
              <div>
                <span className="text-xs text-slate-400">Total ({totalTickets} tiket)</span>
                <p className="text-xl font-black text-brand-700">{formatRupiah(total)}</p>
              </div>
              <span className="rounded-md border border-emerald-200 bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-600">
                Bebas biaya admin
              </span>
            </div>

            <button
              type="button"
              onClick={handleContinue}
              disabled={maxQty === 0}
              className={`mt-4 w-full rounded-2xl bg-gradient-to-r from-brand-600 to-brand-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-600/20 transition hover:from-brand-700 hover:to-brand-600 active:scale-95 ${
                maxQty === 0 ? "cursor-not-allowed opacity-50" : ""
              }`}
            >
              {maxQty === 0 ? "Tiket Habis" : "Lanjut Isi Detail Pemesan"}
            </button>

            <Link
              href={`/event/${event.slug}`}
              className="mt-3 flex items-center justify-center gap-1.5 text-xs font-bold text-slate-500 hover:text-brand-700"
            >
              <Icon name="arrowLeft" className="h-3.5 w-3.5" />
              Kembali ke detail event
            </Link>
          </div>
        </aside>
      </div>
    </main>
  );
}
