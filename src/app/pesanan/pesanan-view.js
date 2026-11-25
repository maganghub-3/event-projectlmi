"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/app/landing/Navbar";
import Icon from "@/app/landing/Icon";
import SiteFooter from "@/components/layout/site-footer";
import notify from "@/lib/sweetalert";
import { getEventBySlug } from "@/app/landing/data";
import { cancelOrder, readOrders } from "@/lib/booking-store";

const MONTH_NAMES = {
  JAN: "Januari", FEB: "Februari", MAR: "Maret", APR: "April",
  MEI: "Mei", JUN: "Juni", JUL: "Juli", AGU: "Agustus",
  SEP: "September", OKT: "Oktober", NOV: "November", DES: "Desember",
};

function formatRupiah(value) {
  return `Rp ${value.toLocaleString("id-ID")}`;
}

export default function PesananView() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.resolve().then(() => {
      setOrders(readOrders());
      setLoading(false);
    });
  }, []);

  const handleCancel = (id) => {
    cancelOrder(id);
    setOrders(readOrders());
    notify.toast(`Pesanan ${id} dibatalkan.`);
  };

  return (
    <div className="min-h-screen bg-[#F7F8FC] text-slate-800 flex flex-col font-sans">
      <Navbar />

      <main className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-8 pb-16">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Link href="/" className="hover:text-brand-700 transition">Beranda</Link>
          <span className="text-slate-300">/</span>
          <span className="text-slate-700">Pesanan Saya</span>
        </nav>

        <div className="mt-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              Pesanan &amp; Tiket Saya
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Semua pesanan tersimpan di browser ini (simulasi, belum tersinkron ke akun).
            </p>
          </div>
          <Link
            href="/#event"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:border-brand-300 hover:text-brand-700"
          >
            Cari Event
            <Icon name="arrowRight" className="h-3.5 w-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="mt-7 h-64 animate-pulse rounded-3xl bg-white" />
        ) : orders.length === 0 ? (
          <div className="mt-7 rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <Icon name="ticket" className="mx-auto h-12 w-12 text-slate-300" />
            <h2 className="mt-3 text-lg font-extrabold text-slate-900">Belum ada pesanan</h2>
            <p className="mt-1 text-sm text-slate-500">
              Pesan tiket event favoritmu untuk melihatnya di sini.
            </p>
            <Link
              href="/#event"
              className="mt-4 inline-flex rounded-xl bg-brand-600 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-brand-700"
            >
              Jelajahi Event
            </Link>
          </div>
        ) : (
          <div className="mt-7 space-y-4">
            {orders.map((order) => {
              const event = getEventBySlug(order.eventSlug);
              const isPaid = order.status === "paid";

              return (
                <article
                  key={order.id}
                  className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-6"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-mono text-[11px] font-bold text-slate-400">{order.id}</p>
                      <h2 className="mt-1 text-base font-extrabold text-slate-900">
                        {event ? event.title : "Event tidak ditemukan"}
                      </h2>
                      {event && (
                        <p className="mt-0.5 text-xs text-slate-500">
                          {event.day} {MONTH_NAMES[event.month] || event.month} {event.year} • {event.venue}
                        </p>
                      )}
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-[11px] font-extrabold ${
                        isPaid
                          ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                          : "bg-amber-50 text-amber-700 ring-1 ring-amber-200"
                      }`}
                    >
                      {isPaid ? "Lunas" : "Menunggu Pembayaran"}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap items-end justify-between gap-3 border-t border-slate-100 pt-4">
                    <div className="text-xs text-slate-500">
                      <p>
                        {order.qty} paket • {order.ticketTypeName || "Tiket"} •{" "}
                        {formatRupiah(order.unitPrice)} / paket
                      </p>
                      <p className="mt-1 text-base font-black text-brand-700">{formatRupiah(order.total)}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {event && (
                        <Link
                          href={`/event/${event.slug}`}
                          className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 transition hover:border-brand-300 hover:text-brand-700"
                        >
                          Lihat Event
                        </Link>
                      )}
                      {!isPaid && (
                        <>
                          <Link
                            href="/checkout"
                            className="rounded-xl bg-brand-600 px-4 py-2 text-xs font-extrabold text-white transition hover:bg-brand-700"
                          >
                            Bayar Sekarang
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleCancel(order.id)}
                            className="rounded-xl border border-rose-200 px-4 py-2 text-xs font-bold text-rose-600 transition hover:bg-rose-50"
                          >
                            Batalkan
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {isPaid && (
                    <div className="mt-4 rounded-2xl border border-dashed border-brand-200 bg-brand-50/50 p-4">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-brand-600">
                        Kode E-Ticket
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {order.tickets.map((code) => (
                          <span
                            key={code}
                            className="rounded-lg border border-brand-200 bg-white px-2.5 py-1 font-mono text-[11px] font-bold text-slate-700"
                          >
                            {code}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
