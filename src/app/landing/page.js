"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "./Navbar";
import HeroBanner from "./banner";
import KategoriSection from "./kategori";
import EventSection from "./event";
import BlogSection from "./blog";
import BantuanSection from "./bantuan";
import Footer from "./Footer";
import Icon from "./Icon";

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

      

      {/* 6. BLOG & KILAS EVENT KERJASAMA (File: blog.js) */}
      <BlogSection />

      {/* 7. BANTUAN SECTION (File: bantuan.js) */}
      <BantuanSection />

      {/* 8. FOOTER (File: Footer.js) */}
      <Footer />

    </div>
  );
}
