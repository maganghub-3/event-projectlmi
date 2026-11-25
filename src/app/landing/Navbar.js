"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Icon from "./Icon";
import Button from "@/components/ui/button";
import notify from "@/lib/sweetalert";
import { BRAND } from "@/constants/brand";

const NAV_LINKS = [
  { id: "event",   label: "Event" },
  { id: "kategori",label: "Kategori" },
  { id: "blog",    label: "Blog & Berita" },
  { id: "bantuan", label: "Bantuan" },
];

export default function Navbar({ onOpenCreateEvent }) {
  const pathname = usePathname() || "/";
  const isHome = pathname === "/";
  const [showPromo, setShowPromo]       = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollActiveId, setScrollActiveId] = useState("");
  const indicatorRef                    = useRef(null);
  const navRef                          = useRef(null);

  // Jika di sub-kategori, aktifkan menu 'kategori', jika di home gunakan scrollActiveId
  const activeId = pathname.startsWith("/sub-kategori") ? "kategori" : scrollActiveId;

  const handleCreateEvent = () => {
    if (onOpenCreateEvent) onOpenCreateEvent();
    else notify.info("Formulir pendaftaran event akan segera dibuka!");
  };

  // Lacak section aktif berdasarkan posisi scroll (hanya jika di home page)
  useEffect(() => {
    if (!isHome) return;

    let frame = null;

    const updateActive = () => {
      frame = null;
      // Garis acuan di 35% tinggi layar
      const line = window.innerHeight * 0.35;
      let current = "";

      NAV_LINKS.forEach(({ id }) => {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) {
          current = id;
        }
      });

      // Saat sudah mentok di dasar halaman, aktifkan menu terakhir
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;
      if (atBottom) current = NAV_LINKS[NAV_LINKS.length - 1].id;

      setScrollActiveId((prev) => (prev === current ? prev : current));
    };

    const onScroll = () => {
      if (frame === null) frame = requestAnimationFrame(updateActive);
    };

    updateActive();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame !== null) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [isHome]);

  // Geser indicator ke tombol aktif
  useEffect(() => {
    const nav = navRef.current;
    const indicator = indicatorRef.current;
    if (!nav || !indicator) return;
    const activeBtn = nav.querySelector(`[data-nav="${activeId}"]`);
    if (!activeBtn) {
      indicator.style.opacity = "0";
      return;
    }
    const { offsetLeft, offsetWidth } = activeBtn;
    indicator.style.opacity = "1";
    indicator.style.left  = `${offsetLeft}px`;
    indicator.style.width = `${offsetWidth}px`;
  }, [activeId]);

  return (
    <>
      {/* 1. TOP PROMO BANNER */}
      {showPromo && (
        <div className="bg-gradient-to-r from-brand-600 via-brand-500 to-brand-700 text-white text-xs sm:text-sm font-medium py-2.5 px-4 shadow-sm relative z-40 transition-all">
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 mx-auto sm:mx-0">
              <span className="bg-white/20 px-2 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase">
                Diskon Pengguna Baru
              </span>
              <span>
                Pakai voucher <strong className="bg-white text-brand-700 px-2 py-0.5 rounded font-mono font-bold tracking-wider">{BRAND.voucherCode}</strong> untuk potongan Rp 25.000!
              </span>
            </div>
            <button
              onClick={() => setShowPromo(false)}
              className="text-white/80 hover:text-white hover:bg-white/10 rounded-full p-1 transition"
              aria-label="Tutup promo banner"
            >
              <Icon name="close" className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 2. MAIN NAVBAR & HEADER */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
          
          {/* Logo Brand */}
          <a
            href={isHome ? "#beranda" : "/"}
            onClick={() => {
              if (isHome) setScrollActiveId("");
            }}
            className="flex items-center gap-2.5 group"
            aria-label="LMI Event - Beranda"
          >
            <Image
              src="/images/LMIbiru.png"
              alt="LMI Event - Lembaga Manajemen Infaq"
              width={144}
              height={70}
              priority
              className="h-auto w-36 transition-transform group-hover:scale-105"
            />
          </a>

          {/* Desktop Nav Links */}
          <nav ref={navRef} className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-full border border-slate-200/70 text-sm font-semibold relative">
            {/* Sliding pill indicator */}
            <span
              ref={indicatorRef}
              aria-hidden="true"
              className="absolute top-1.5 h-[calc(100%-12px)] rounded-full bg-white shadow-sm border border-slate-200/60 transition-all duration-300 ease-out pointer-events-none"
            />
            {NAV_LINKS.map(({ id, label }) => (
              <a
                key={id}
                href={isHome ? `#${id}` : `/#${id}`}
                data-nav={id}
                onClick={() => setScrollActiveId(id)}
                className={`group relative z-10 px-4 py-2 rounded-full transition-colors duration-200 ${
                  activeId === id
                    ? "text-slate-900 font-bold"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {label}
                {/* Garis bawah: tampil saat aktif & saat hover */}
                <span
                  aria-hidden="true"
                  className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 h-0.5 rounded-full bg-brand-600 transition-all duration-200 ${
                    activeId === id
                      ? "w-4 opacity-100"
                      : "w-0 opacity-0 group-hover:w-4 group-hover:opacity-100"
                  }`}
                />
              </a>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <Button 
              href="/authentication/login"
              variant="ghost"
              className="text-slate-700 hover:text-brand-700"
            >
              Masuk
            </Button>
            <Button
              href={isHome ? "#organizer" : "/#organizer"}
              onClick={handleCreateEvent}
              variant="primary"
              rightIcon={<Icon name="arrowRight" className="h-4 w-4" />}
            >
              + Buat Event
            </Button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
              aria-label="Menu navigasi"
            >
              <Icon name={mobileMenuOpen ? "close" : "menu"} className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-5 py-4 space-y-1 shadow-lg">
            {NAV_LINKS.map(({ id, label }) => (
              <a
                key={id}
                href={isHome ? `#${id}` : `/#${id}`}
                onClick={() => { setMobileMenuOpen(false); setScrollActiveId(id); }}
                className={`flex items-center gap-2 font-semibold py-2.5 px-3 rounded-xl transition ${
                  activeId === id
                    ? "bg-brand-50 text-brand-700 border-l-4 border-brand-600"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                {label}
              </a>
            ))}
            <div className="pt-3 flex flex-col gap-2">
              <Button
                href="/authentication/login"
                variant="outline"
                rounded="xl"
                fullWidth
                onClick={() => setMobileMenuOpen(false)}
              >
                Masuk ke Akun
              </Button>
              <Button
                href={isHome ? "#organizer" : "/#organizer"}
                onClick={() => { setMobileMenuOpen(false); handleCreateEvent(); }}
                variant="primary"
                rounded="xl"
                fullWidth
                rightIcon={<Icon name="arrowRight" className="h-4 w-4" />}
              >
                + Buat Event Sendiri
              </Button>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
