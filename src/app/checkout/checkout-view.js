"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/app/landing/Navbar";
import Icon from "@/app/landing/Icon";
import SiteFooter from "@/components/layout/site-footer";
import BookingSteps from "@/components/booking/booking-steps";
import notify from "@/lib/sweetalert";
import { getEventBySlug } from "@/app/landing/data";
import { availableTickets, completeOrder, getLatestDraft } from "@/lib/booking-store";

const MONTH_NAMES = {
  JAN: "Januari", FEB: "Februari", MAR: "Maret", APR: "April",
  MEI: "Mei", JUN: "Juni", JUL: "Juli", AGU: "Agustus",
  SEP: "September", OKT: "Oktober", NOV: "November", DES: "Desember",
};

const PAYMENT_METHODS = [
  { id: "qris", label: "QRIS", desc: "BCA, GoPay, OVO, DANA, ShopeePay", icon: "link" },
  { id: "va-bca", label: "Virtual Account BCA", desc: "Transfer bank", icon: "creditCard" },
  { id: "ewallet", label: "E-Wallet", desc: "GoPay / OVO / DANA", icon: "wallet" },
];

const EMPTY_FORM = { name: "", email: "", phone: "" };

function formatRupiah(value) {
  return `Rp ${value.toLocaleString("id-ID")}`;
}

function formatDate(event) {
  return `${event.day} ${MONTH_NAMES[event.month] || event.month} ${event.year}`;
}

export default function CheckoutView() {
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [event, setEvent] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [paymentMethod, setPaymentMethod] = useState("qris");
  const [paidOrder, setPaidOrder] = useState(null);
  const [invalid, setInvalid] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.resolve().then(() => {
      const draft = getLatestDraft();
      if (!draft) {
        setLoading(false);
        return;
      }

      const required = draft.qty * (draft.ticketCount || 1);
      const foundEvent = getEventBySlug(draft.eventSlug);
      if (!foundEvent || required > availableTickets(foundEvent)) {
        setInvalid(true);
        setLoading(false);
        return;
      }

      setOrder(draft);
      setEvent(foundEvent);
      setLoading(false);
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!order || !event) return;

    const required = order.qty * (order.ticketCount || 1);
    if (required > availableTickets(event)) {
      notify.error("Sisa tiket sudah berkurang. Silakan pesan ulang.");
      router.push(`/event/${event.slug}/tiket`);
      return;
    }

    const completed = completeOrder(order.id, form, paymentMethod);
    setPaidOrder(completed);
    notify.success("Pembayaran berhasil! E-ticket kamu sudah tersedia.");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#F7F8FC] text-slate-800 flex flex-col font-sans selection:bg-brand-200 selection:text-brand-900">
      <Navbar />

      <main className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-8 pb-16">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Link href="/" className="hover:text-brand-700 transition">Beranda</Link>
          <span className="text-slate-300">/</span>
          <span className="text-slate-700">Checkout Tiket</span>
        </nav>

        {loading ? (
          <div className="mt-8 h-72 animate-pulse rounded-3xl bg-white" />
        ) : paidOrder && event ? (
          /* ---------- SUKSES ---------- */
          <section className="mt-8 overflow-hidden rounded-3xl border border-emerald-200 bg-white shadow-sm">
            <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-8 text-center text-white">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white/20">
                <Icon name="check" className="h-8 w-8" />
              </span>
              <h1 className="mt-3 text-2xl font-black sm:text-3xl">Pembayaran Berhasil!</h1>
              <p className="mt-1 text-sm text-white/85">
                E-ticket untuk &ldquo;{event.title}&rdquo; sudah siap.
              </p>
            </div>

            <div className="p-6 sm:p-8">
              <div className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-xs sm:grid-cols-2 sm:text-sm">
                <div>
                  <p className="font-bold text-slate-400">Nomor Pesanan</p>
                  <p className="mt-0.5 font-mono font-extrabold text-slate-900">{paidOrder.id}</p>
                </div>
                <div>
                  <p className="font-bold text-slate-400">Total Dibayar</p>
                  <p className="mt-0.5 font-black text-brand-700">{formatRupiah(paidOrder.total)}</p>
                </div>
                <div>
                  <p className="font-bold text-slate-400">Dikirim ke</p>
                  <p className="mt-0.5 font-semibold text-slate-800">{paidOrder.buyer.email}</p>
                </div>
                <div>
                  <p className="font-bold text-slate-400">Metode</p>
                  <p className="mt-0.5 font-semibold text-slate-800">
                    {PAYMENT_METHODS.find((m) => m.id === paidOrder.paymentMethod)?.label}
                  </p>
                </div>
              </div>

              <h2 className="mt-6 text-sm font-extrabold text-slate-900">
                E-Ticket ({paidOrder.tickets.length})
              </h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {paidOrder.tickets.map((code, index) => (
                  <div
                    key={code}
                    className="rounded-2xl border border-dashed border-brand-200 bg-brand-50/50 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-brand-600">
                          Tiket {index + 1}
                        </p>
                        <p className="mt-0.5 truncate text-sm font-extrabold text-slate-900">
                          {event.title}
                        </p>
                        <p className="mt-0.5 text-[11px] text-slate-500">
                          {formatDate(event)} • {event.time}
                        </p>
                      </div>
                      <Icon name="ticket" className="h-5 w-5 shrink-0 text-brand-600" />
                    </div>
                    <p className="mt-3 border-t border-dashed border-brand-200 pt-2 font-mono text-xs font-bold text-slate-700">
                      {code}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/pesanan"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-sm font-extrabold text-white shadow-md shadow-brand-600/20 transition hover:bg-brand-700"
                >
                  Lihat Pesanan Saya
                  <Icon name="arrowRight" className="h-4 w-4" />
                </Link>
                <Link
                  href="/#event"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-brand-300 hover:text-brand-700"
                >
                  Cari Event Lain
                </Link>
              </div>
            </div>
          </section>
        ) : invalid ? (
          <div className="mt-8 rounded-3xl border border-amber-200 bg-amber-50 p-8 text-center">
            <Icon name="alert" className="mx-auto h-10 w-10 text-amber-600" />
            <h1 className="mt-3 text-lg font-extrabold text-slate-900">Pesanan tidak valid</h1>
            <p className="mt-1 text-sm text-slate-600">
              Sisa tiket sudah berubah atau event tidak ditemukan. Silakan pesan ulang.
            </p>
            <Link
              href="/#event"
              className="mt-4 inline-flex rounded-xl bg-brand-600 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-brand-700"
            >
              Lihat Event
            </Link>
          </div>
        ) : !order || !event ? (
          /* ---------- KOSONG ---------- */
          <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <Icon name="ticket" className="mx-auto h-12 w-12 text-slate-300" />
            <h1 className="mt-3 text-lg font-extrabold text-slate-900">Belum ada pesanan</h1>
            <p className="mt-1 text-sm text-slate-500">
              Pilih event dan klik &ldquo;Pesan Tiket&rdquo; untuk memulai checkout.
            </p>
            <Link
              href="/#event"
              className="mt-4 inline-flex rounded-xl bg-brand-600 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-brand-700"
            >
              Jelajahi Event
            </Link>
          </div>
        ) : (
          /* ---------- CHECKOUT ---------- */
          <>
            <Link
              href={`/event/${order.eventSlug}/tiket`}
              className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 hover:underline"
            >
              <Icon name="arrowLeft" className="h-4 w-4" />
              Kembali ke Kategori Tiket
            </Link>

            <div className="mt-4">
              <BookingSteps current={2} />
            </div>

            <div className="mt-5 grid gap-6 lg:grid-cols-12 lg:items-start">
              {/* Form pembeli */}
              <form onSubmit={handleSubmit} className="space-y-5 lg:col-span-7">
                <section className="rounded-3xl border border-slate-200/80 bg-white p-6">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                      <Icon name="users" className="h-5 w-5" />
                    </span>
                    <div>
                      <h1 className="text-lg font-extrabold text-slate-900">Data Pembeli</h1>
                      <p className="text-xs text-slate-500">E-ticket dikirim ke email dan WhatsApp ini.</p>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5 sm:col-span-2">
                      <label htmlFor="name" className="text-xs font-bold text-slate-700">Nama Lengkap</label>
                      <input
                        id="name" name="name" type="text" required
                        value={form.name} onChange={handleChange}
                        placeholder="Sesuai identitas"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3 text-sm outline-none focus:border-brand-400 focus:bg-white focus:ring-4 focus:ring-brand-100"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="email" className="text-xs font-bold text-slate-700">Email</label>
                      <input
                        id="email" name="email" type="email" required
                        value={form.email} onChange={handleChange}
                        placeholder="nama@email.com"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3 text-sm outline-none focus:border-brand-400 focus:bg-white focus:ring-4 focus:ring-brand-100"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="phone" className="text-xs font-bold text-slate-700">Nomor WhatsApp</label>
                      <input
                        id="phone" name="phone" type="tel" inputMode="tel" required
                        value={form.phone} onChange={handleChange}
                        placeholder="08xx-xxxx-xxxx"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3 text-sm outline-none focus:border-brand-400 focus:bg-white focus:ring-4 focus:ring-brand-100"
                      />
                    </div>
                  </div>
                </section>

                <section className="rounded-3xl border border-slate-200/80 bg-white p-6">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                      <Icon name="creditCard" className="h-5 w-5" />
                    </span>
                    <div>
                      <h2 className="text-lg font-extrabold text-slate-900">Metode Pembayaran</h2>
                      <p className="text-xs text-slate-500">Pilih satu metode pembayaran.</p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    {PAYMENT_METHODS.map((method) => (
                      <label
                        key={method.id}
                        className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-4 transition ${
                          paymentMethod === method.id
                            ? "border-brand-400 bg-brand-50/60"
                            : "border-slate-200 hover:border-brand-200"
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.id}
                          checked={paymentMethod === method.id}
                          onChange={() => setPaymentMethod(method.id)}
                          className="h-4 w-4 accent-[#3b4197]"
                        />
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-brand-600">
                          <Icon name={method.icon} className="h-4 w-4" />
                        </span>
                        <span className="flex-1">
                          <span className="block text-sm font-bold text-slate-900">{method.label}</span>
                          <span className="block text-[11px] text-slate-500">{method.desc}</span>
                        </span>
                      </label>
                    ))}
                  </div>
                </section>

                <div className="rounded-3xl border border-amber-200 bg-amber-50 p-4 text-[11px] leading-relaxed text-amber-800">
                  <strong>Catatan simulasi:</strong> tidak ada pembayaran sungguhan yang diproses. Pesanan hanya disimpan di browser ini dan siap dihubungkan ke API/payment gateway nanti.
                </div>

                <button
                  type="submit"
                  className="w-full rounded-2xl bg-gradient-to-r from-brand-600 to-brand-500 py-4 text-sm font-extrabold text-white shadow-lg shadow-brand-600/20 transition hover:from-brand-700 hover:to-brand-600 active:scale-95"
                >
                  Bayar {formatRupiah(order.total)}
                </button>
              </form>

              {/* Ringkasan */}
              <aside className="lg:col-span-5">
                <div className="lg:sticky lg:top-24 rounded-3xl border border-slate-200/80 bg-white p-6">
                  <h2 className="text-sm font-extrabold text-slate-900">Ringkasan Pesanan</h2>
                  <p className="mt-0.5 font-mono text-[11px] text-slate-400">{order.id}</p>

                  <div className="mt-4 flex gap-3">
                    <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                      <Image src={event.image} alt={event.alt} fill sizes="96px" className="object-cover" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-extrabold leading-snug text-slate-900">{event.title}</p>
                      <p className="mt-1 text-[11px] text-slate-500">{formatDate(event)} • {event.time}</p>
                      <p className="mt-0.5 truncate text-[11px] text-slate-500">{event.venue}</p>
                      <p className="mt-1 inline-flex rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-bold text-brand-700">
                        {order.ticketTypeName} • {order.qty} paket
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 space-y-2 border-t border-slate-100 pt-4 text-xs">
                    <div className="flex justify-between text-slate-500">
                      <span>{order.ticketTypeName} × {order.qty} paket</span>
                      <span className="font-semibold text-slate-700">{formatRupiah(order.total)}</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Biaya layanan</span>
                      <span className="font-bold text-emerald-600">Gratis</span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-end justify-between border-t border-slate-100 pt-4">
                    <span className="text-xs font-bold text-slate-500">Total Pembayaran</span>
                    <span className="text-xl font-black text-brand-700">{formatRupiah(order.total)}</span>
                  </div>

                  <Link
                    href={`/event/${event.slug}/tiket`}
                    className="mt-4 block text-center text-xs font-bold text-brand-700 hover:underline"
                  >
                    Ubah kategori tiket
                  </Link>
                </div>
              </aside>
            </div>
          </>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
