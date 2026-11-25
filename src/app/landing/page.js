"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Navbar from "./Navbar";
import HeroBanner from "./banner";
import KategoriSection from "./kategori";
import EventSection from "./event";
import BlogSection from "./blog";
import BantuanSection from "./bantuan";
import Icon from "./Icon";
import notify from "@/lib/sweetalert";
import { BRAND } from "@/constants/brand";

export default function LandingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("Semua Kota");
  const [activeCategory, setActiveCategory] = useState("all");
  const router = useRouter();

  // Scroll reveal observer — animasi kartu muncul saat di-scroll
  useEffect(() => {
    const elements = document.querySelectorAll("[data-reveal]");
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Pindah ke halaman sub kategori setelah user memilih kategori
  const handleSelectCategory = (id) => {
    router.push(`/sub-kategori?c=${encodeURIComponent(id)}`);
  };

  return (
    <div className="min-h-screen bg-[#F7F8FC] text-slate-800 flex flex-col font-sans selection:bg-brand-200 selection:text-brand-900">

      {/* 1. NAVBAR & HEADER (File: Navbar.js) */}
      <Navbar />

      {/* 2. HERO SECTION DENGAN 3D STACKED BANNER (SEPERTI ARTATIX) */}
      <section id="beranda" className="relative overflow-hidden pt-6 pb-12 md:pt-10 md:pb-16 scroll-mt-20">
        
        {/* Background glow accents (Pulsing Glow) */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[900px] h-[350px] bg-gradient-to-r from-brand-200/50 via-brand-100/40 to-brand-300/30 blur-3xl -z-10 rounded-full pointer-events-none animate-pulse-glow" />

        {/* 3D COVERFLOW STACKED CAROUSEL (File: banner.js - Sangat mudah di-custom!) */}
        <div className="max-w-7xl mx-auto">
          <HeroBanner 
            onSlideClick={(banner, idx) => {
              notify.toast(`Membuka banner ke-${idx + 1}`);
            }}
          />
        </div>

        {/* Sapaan & Capsule Search Bar di bawah Carousel */}
        <div data-reveal="bottom" className="max-w-4xl mx-auto px-4 sm:px-6 mt-8 sm:mt-10">
          <div className="text-center space-y-4 mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 border border-brand-200 shadow-sm text-xs sm:text-sm font-bold text-brand-700">
              <span>Mau seru-seruan ke mana akhir pekan ini?</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              Cari &amp; Beli Tiket Resmi Paling Nyaman di Indonesia
            </h1>
          </div>

          {/* Capsule Search Bar */}
          <div className="bg-white p-3 sm:p-4 rounded-3xl shadow-xl shadow-slate-200/70 border border-slate-200/90 text-left">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              
              <div className="sm:col-span-6 flex items-center gap-3 px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200/60 focus-within:border-brand-400 focus-within:bg-white transition-all">
                <Icon name="search" className="w-5 h-5 text-brand-600 shrink-0" />
                <div className="w-full">
                  <label htmlFor="hero-search" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Cari Event Seru
                  </label>
                  <input
                    id="hero-search"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Konser, artis, atau workshop..."
                    className="w-full bg-transparent text-sm font-semibold text-slate-800 placeholder-slate-400 outline-none"
                  />
                </div>
              </div>

              <div className="sm:col-span-6 flex items-center gap-3 px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200/60 focus-within:border-brand-400 focus-within:bg-white transition-all">
                <Icon name="mapPin" className="w-5 h-5 text-brand-500 shrink-0" />
                <div className="w-full">
                  <label htmlFor="city-select" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Lokasi Kota
                  </label>
                  <select
                    id="city-select"
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full bg-transparent text-sm font-bold text-slate-800 outline-none cursor-pointer"
                  >
                    <option value="Semua Kota">Semua Kota</option>
                    <option value="Jakarta">Jakarta</option>
                    <option value="Bandung">Bandung</option>
                    <option value="Surabaya">Surabaya</option>
                    <option value="Yogyakarta">Yogyakarta</option>
                    <option value="Bali">Bali</option>
                  </select>
                </div>
              </div>

            </div>

            {/* Quick trending tags */}
            <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-400 font-medium">Tren saat ini:</span>
              {[
                { label: "Konser Indie", query: "indie" },
                { label: "Kuliner", query: "kuliner" },
                { label: "Pottery", query: "ceramic" },
                { label: "Yoga", query: "yoga" },
              ].map((chip) => (
                <button
                  key={chip.label}
                  type="button"
                  onClick={() => setSearchQuery(chip.query)}
                  className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-brand-100 hover:text-brand-700 text-slate-600 font-semibold transition"
                >
                  {chip.label}
                </button>
              ))}
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="text-xs text-rose-500 hover:underline font-bold ml-auto"
                >
                  Reset Cari ✕
                </button>
              )}
            </div>
          </div>

          {/* Social Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-5 text-xs text-slate-500 font-medium">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center font-bold">✓</span>
              <span>100% Tiket Resmi &amp; Bergaransi</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center"><Icon name="sparkles" className="h-3 w-3" /></span>
              <span>E-ticket langsung via WhatsApp</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center"><Icon name="shield" className="h-3 w-3" /></span>
              <span>Bebas Biaya Admin Siluman</span>
            </div>
          </div>

        </div>
      </section>

      {/* 3. EVENT SECTION (File: event.js) — langsung di bawah pencarian */}
      <EventSection
        activeCategory={activeCategory}
        searchQuery={searchQuery}
        selectedCity={selectedCity}
        onResetFilters={() => {
          setActiveCategory("all");
          setSelectedCity("Semua Kota");
          setSearchQuery("");
        }}
      />

      {/* 4. KATEGORI SECTION (File: kategori.js) — di bawah daftar event */}
      <KategoriSection
        activeCategory={activeCategory}
        onSelectCategory={handleSelectCategory}
      />

      {/* 5. KEUNGGULAN SECTION (KENAPA PILIH LMI EVENT?)
      <section id="keunggulan" className="py-16 bg-white border-y border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-extrabold uppercase tracking-wider text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-200/60">
              Paling Nyaman &amp; Menenangkan
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-2">
              Kenapa Teman {BRAND.name} Suka Banget?
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Pengalaman beli tiket yang manusiawi, tanpa biaya tersembunyi, dan selalu siap sedia membantu.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div
              data-reveal="bottom"
              style={{ transitionDelay: "50ms" }}
              className="group p-6 rounded-3xl bg-[#F7F8FC] border border-slate-200/70 hover:border-brand-300 hover:bg-white hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-2xl bg-brand-100 text-brand-700 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                <Icon name="shield" className="h-6 w-6" />
              </div>
              <h3 className="font-extrabold text-base text-slate-900 mb-2 group-hover:text-brand-700 transition-colors">100% Tiket Resmi</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Langsung dari promotor resmi. Ucapkan selamat tinggal pada calo dan rasa was-was tiket palsu.
              </p>
            </div>

            <div
              data-reveal="bottom"
              style={{ transitionDelay: "150ms" }}
              className="group p-6 rounded-3xl bg-[#F7F8FC] border border-slate-200/70 hover:border-brand-300 hover:bg-white hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-2xl bg-brand-100 text-brand-600 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300">
                <Icon name="sparkles" className="h-6 w-6" />
              </div>
              <h3 className="font-extrabold text-base text-slate-900 mb-2 group-hover:text-brand-700 transition-colors">Cepat Dalam 1 Menit</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Pilih tiket, bayar pakai QRIS, dan e-ticket langsung masuk ke WhatsApp kamu tanpa nunggu lama.
              </p>
            </div>

            <div
              data-reveal="bottom"
              style={{ transitionDelay: "250ms" }}
              className="group p-6 rounded-3xl bg-[#F7F8FC] border border-slate-200/70 hover:border-brand-300 hover:bg-white hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-2xl bg-brand-100 text-brand-600 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                <Icon name="chat" className="h-6 w-6" />
              </div>
              <h3 className="font-extrabold text-base text-slate-900 mb-2 group-hover:text-brand-700 transition-colors">CS Manusia Ramah 24/7</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Bukan bot kaku! Ada tim kami yang siap mendengarkan dan membantu kendalamu lewat WhatsApp.
              </p>
            </div>

            <div
              data-reveal="bottom"
              style={{ transitionDelay: "350ms" }}
              className="group p-6 rounded-3xl bg-[#F7F8FC] border border-slate-200/70 hover:border-brand-300 hover:bg-white hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-2xl bg-brand-100 text-brand-600 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300">
                <Icon name="wallet" className="h-6 w-6" />
              </div>
              <h3 className="font-extrabold text-base text-slate-900 mb-2 group-hover:text-brand-700 transition-colors">Harga Transparan</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Harga yang kamu lihat adalah harga yang kamu bayar. Tanpa biaya siluman di checkout.
              </p>
            </div>
          </div>
        </div>
      </section> */}

      {/* 6. BLOG & KILAS EVENT KERJASAMA (File: blog.js) */}
      <BlogSection />

      {/* 7. BANTUAN SECTION (File: bantuan.js) */}
      <BantuanSection />

      {/* 8. FOOTER */}
      <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800 text-sm">
            
            <div className="lg:col-span-2 space-y-4">
              <a href="#beranda" className="inline-flex items-center" aria-label="LMI Event - Beranda">
                <Image
                  src="/images/lmi-logo.png"
                  alt="LMI Event - Lembaga Manajemen Infaq"
                  width={144}
                  height={70}
                  className="h-auto w-32"
                />
              </a>
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                Platform tiket event paling ramah di Indonesia. Kami menghubungkan pencinta musik, seni, kuliner, dan komunitas dengan pengalaman tak terlupakan.
              </p>
              <div className="flex items-center gap-3 text-lg">
                <Icon name="camera" className="h-5 w-5 cursor-pointer hover:text-brand-400 transition" />
                <Icon name="music" className="h-5 w-5 cursor-pointer hover:text-brand-400 transition" />
                <Icon name="chat" className="h-5 w-5 cursor-pointer hover:text-brand-400 transition" />
                <Icon name="globe" className="h-5 w-5 cursor-pointer hover:text-brand-400 transition" />
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Kota Populer</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><button type="button" onClick={() => { setSelectedCity("Jakarta"); notify.toast("Menampilkan event Jakarta"); }} className="hover:text-white transition">Event di Jakarta</button></li>
                <li><button type="button" onClick={() => { setSelectedCity("Bandung"); notify.toast("Menampilkan event Bandung"); }} className="hover:text-white transition">Event di Bandung</button></li>
                <li><button type="button" onClick={() => { setSelectedCity("Surabaya"); notify.toast("Menampilkan event Surabaya"); }} className="hover:text-white transition">Event di Surabaya</button></li>
                <li><button type="button" onClick={() => { setSelectedCity("Yogyakarta"); notify.toast("Menampilkan event Yogyakarta"); }} className="hover:text-white transition">Event di Yogyakarta</button></li>
                <li><button type="button" onClick={() => { setSelectedCity("Bali"); notify.toast("Menampilkan event Bali"); }} className="hover:text-white transition">Event di Bali</button></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Kategori</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><button type="button" onClick={() => handleSelectCategory("musik")} className="hover:text-white transition">Konser &amp; Musik</button></li>
                <li><button type="button" onClick={() => handleSelectCategory("festival")} className="hover:text-white transition">Festival Kuliner</button></li>
                <li><button type="button" onClick={() => handleSelectCategory("workshop")} className="hover:text-white transition">Workshop Kreatif</button></li>
                <li><button type="button" onClick={() => handleSelectCategory("seni")} className="hover:text-white transition">Pameran &amp; Seni</button></li>
                <li><button type="button" onClick={() => handleSelectCategory("olahraga")} className="hover:text-white transition">Olahraga &amp; Healing</button></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Butuh Bantuan?</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><span className="text-slate-300 font-medium">WhatsApp CS:</span> 0812-3456-7890</li>
                <li><span className="text-slate-300 font-medium">Email:</span> {BRAND.email}</li>
                <li><span className="text-slate-300 font-medium">Jam Layanan:</span> 08.00 - 23.00 WIB</li>
                <li><a href="#bantuan" className="hover:text-white underline">Pusat Bantuan &amp; FAQ</a></li>
                <li><a href="/hubungi-kami" className="hover:text-white underline">Hubungi Kami</a></li>
              </ul>
            </div>

          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>{BRAND.copyright}</p>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-slate-300 transition">Syarat &amp; Ketentuan</a>
              <span>•</span>
              <a href="#" className="hover:text-slate-300 transition">Kebijakan Privasi</a>
              <span>•</span>
              <a href="#" className="hover:text-slate-300 transition">Panduan Keamanan</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
