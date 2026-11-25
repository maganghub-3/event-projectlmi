"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/app/landing/Navbar";
import Icon from "@/app/landing/Icon";
import SiteFooter from "@/components/layout/site-footer";
import notify from "@/lib/sweetalert";
import { BRAND } from "@/constants/brand";
import { CONTACT } from "@/constants/contact";

const WHATSAPP_DISPLAY = CONTACT.whatsappDisplay;
const WHATSAPP_LINK = CONTACT.whatsappLink;

const TOPICS = [
  "Pertanyaan seputar tiket",
  "Kendala pembayaran",
  "Pengembalian dana",
  "Kerja sama & sponsor",
  "Menjadi Event Organizer",
  "Lainnya",
];

const CONTACT_CHANNELS = [
  {
    icon: "chat",
    title: "WhatsApp CS",
    value: WHATSAPP_DISPLAY,
    desc: "Balasan rata-rata di bawah 5 menit.",
    href: WHATSAPP_LINK,
    external: true,
  },
  {
    icon: "mail",
    title: "Email",
    value: BRAND.email,
    desc: "Untuk pertanyaan detail dan lampiran dokumen.",
    href: `mailto:${BRAND.email}`,
  },
  {
    icon: "clock",
    title: "Jam Layanan",
    value: CONTACT.serviceHours,
    desc: "Setiap hari, termasuk akhir pekan.",
  },
];

const INPUT_CLASS =
  "w-full rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-brand-400 focus:bg-white focus:ring-4 focus:ring-brand-100";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  topic: TOPICS[0],
  message: "",
};

export default function HubungiKamiPage() {
  const [form, setForm] = useState(emptyForm);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    notify.success(
      `Terima kasih, ${form.name.split(" ")[0]}! Pesanmu sudah kami terima dan akan dibalas maksimal 1x24 jam.`
    );
    setForm(emptyForm);
  };

  return (
    <div className="min-h-screen bg-[#F7F8FC] text-slate-800 flex flex-col font-sans selection:bg-brand-200 selection:text-brand-900">
      <Navbar />

      {/* 1. HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 via-white to-white border-b border-slate-100">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -right-16 h-64 w-64 rounded-full bg-brand-100/80 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-brand-100/60 blur-3xl"
        />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-14 md:py-20 text-center">
          <span className="text-xs font-extrabold uppercase tracking-wider text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
            Hubungi Kami
          </span>
          <h1 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900">
            Ada yang bisa kami bantu?
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Mulai dari pertanyaan soal tiket, kendala pembayaran, sampai rencana
            membuat event bareng {BRAND.name}. Tim kami siap membantu setiap hari.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-semibold text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <Icon name="clock" className="h-4 w-4 text-brand-600" />
              Respon cepat, rata-rata di bawah 5 menit
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Icon name="shield" className="h-4 w-4 text-brand-600" />
              Ditangani langsung oleh tim resmi LMI
            </span>
          </div>
        </div>
      </section>

      {/* 2. FORM & CHANNEL KONTAK */}
      <section className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-14 md:py-16">
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <Icon name="edit" className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                    Kirim Pesan
                  </h2>
                  <p className="mt-1 text-xs sm:text-sm text-slate-500">
                    Isi formulir di bawah, kami balas lewat email atau WhatsApp
                    yang kamu cantumkan.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label htmlFor="name" className="block text-xs font-bold text-slate-700">
                    Nama Lengkap
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Nama kamu"
                    className={INPUT_CLASS}
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="email" className="block text-xs font-bold text-slate-700">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder="nama@email.com"
                    className={INPUT_CLASS}
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="phone" className="block text-xs font-bold text-slate-700">
                    Nomor WhatsApp
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    required
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="08xx-xxxx-xxxx"
                    className={INPUT_CLASS}
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="topic" className="block text-xs font-bold text-slate-700">
                    Topik
                  </label>
                  <select
                    id="topic"
                    name="topic"
                    value={form.topic}
                    onChange={handleChange}
                    className={INPUT_CLASS}
                  >
                    {TOPICS.map((topic) => (
                      <option key={topic} value={topic}>
                        {topic}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label htmlFor="message" className="block text-xs font-bold text-slate-700">
                    Pesan
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Ceritakan pertanyaan atau kendalamu secara singkat..."
                    className={`${INPUT_CLASS} resize-none`}
                  />
                </div>

                <div className="sm:col-span-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-[11px] text-slate-400 leading-relaxed max-w-xs">
                    Dengan mengirim pesan, kamu setuju data yang diisi hanya
                    digunakan untuk keperluan balasan tim {BRAND.name}.
                  </p>
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-extrabold text-white shadow-lg shadow-brand-600/20 transition hover:bg-brand-700 active:scale-95"
                  >
                    Kirim Pesan
                    <Icon name="arrowRight" className="h-4 w-4" />
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Kanal kontak & CTA organizer */}
          <div className="lg:col-span-5 space-y-4">
            {CONTACT_CHANNELS.map((channel) => {
              const Tag = channel.href ? "a" : "div";
              const linkProps = channel.href
                ? {
                    href: channel.href,
                    ...(channel.external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {}),
                  }
                : {};

              return (
                <Tag
                  key={channel.title}
                  {...linkProps}
                  className={`group flex items-start gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 transition ${
                    channel.href
                      ? "hover:border-brand-300 hover:shadow-md hover:-translate-y-0.5"
                      : ""
                  }`}
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                    <Icon name={channel.icon} className="h-5 w-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      {channel.title}
                    </span>
                    <span className="mt-0.5 block break-words text-sm font-extrabold text-slate-900 group-hover:text-brand-700">
                      {channel.value}
                    </span>
                    <span className="mt-1 block text-xs text-slate-500 leading-relaxed">
                      {channel.desc}
                    </span>
                  </span>
                </Tag>
              );
            })}

            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 p-6 text-white shadow-xl shadow-brand-600/20">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-white/10 blur-2xl"
              />
              <div className="relative">
                <Icon name="sparkles" className="h-6 w-6 text-white/80" />
                <h3 className="mt-3 text-lg font-extrabold leading-tight">
                  Punya ide event seru?
                </h3>
                <p className="mt-1.5 text-xs text-white/80 leading-relaxed">
                  Dari gathering komunitas 20 orang sampai festival ribuan
                  penonton. Ceritakan rencanamu, kami bantu dari halaman tiket
                  sampai pencairan dana.
                </p>
                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-extrabold text-brand-700 transition hover:bg-brand-50"
                >
                  Konsultasi Gratis
                  <Icon name="arrowRight" className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>

            <Link
              href="/#bantuan"
              className="group flex items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white p-5 transition hover:border-brand-300 hover:shadow-md"
            >
              <span>
                <span className="block text-sm font-bold text-slate-900 group-hover:text-brand-700">
                  Butuh jawaban cepat?
                </span>
                <span className="mt-0.5 block text-xs text-slate-500">
                  Lihat Pusat Bantuan &amp; FAQ sebelum menghubungi kami.
                </span>
              </span>
              <Icon name="arrowRight" className="h-4 w-4 shrink-0 text-brand-600" />
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
