"use client";

import Image from "next/image";
import Link from "next/link";
import { BRAND } from "@/constants/brand";

const ABOUT_LINKS = [
  { label: "Tentang Kami", href: "/tentang-kami" },
  { label: "Hubungi Kami", href: "/hubungi-kami" },
  { label: "Biaya", href: "/#bantuan" },
];

const INFO_LINKS = [
  { label: "Syarat & Ketentuan", href: "/#bantuan" },
  { label: "Kebijakan Privasi & Pemrosesan Data", href: "/#bantuan" },
  { label: "FAQ", href: "/#bantuan" },
  { label: "Validasi Tiket", href: "/#bantuan" },
];

const CATEGORY_LINKS = [
  { label: "Musik", href: "/sub-kategori?c=musik" },
  { label: "Pameran", href: "/sub-kategori?c=seni" },
  { label: "Wahana", href: "/sub-kategori?c=festival" },
  { label: "Olahraga", href: "/sub-kategori?c=olahraga" },
  { label: "Semua Kategori", href: "/sub-kategori?c=all" },
];

const SOCIAL_LINKS = [
  {
    name: "WhatsApp",
    href: "https://wa.me/6281234567890",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
        <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2Zm5.82 14.12c-.25.7-1.45 1.34-2.01 1.42-.51.08-1.17.11-1.89-.12-.44-.14-1-.33-1.72-.64-3.02-1.3-4.99-4.33-5.14-4.53-.15-.2-1.23-1.64-1.23-3.13 0-1.49.78-2.22 1.06-2.52.28-.3.61-.38.81-.38.2 0 .4 0 .58.01.19.01.44-.07.69.53.25.6.86 2.1.94 2.25.08.15.13.33.03.53-.1.2-.15.33-.3.5-.15.18-.32.4-.45.53-.15.15-.31.32-.13.62.18.3.79 1.3 1.7 2.11 1.17 1.04 2.15 1.36 2.45 1.51.3.15.48.13.66-.08.18-.2.76-.88.96-1.19.2-.3.4-.25.68-.15.28.1 1.77.83 2.07.98.3.15.5.23.58.35.08.13.08.73-.17 1.43Z" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    href: "https://instagram.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden="true">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
      </svg>
    ),
  },
  {
    name: "TikTok",
    href: "https://tiktok.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
      </svg>
    ),
  },
  {
    name: "X",
    href: "https://x.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
      </svg>
    ),
  },
  {
    name: "YouTube",
    href: "https://youtube.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  
];

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-800 text-sm">
          {/* Brand Column (Logo LMI Event Asli) */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/#beranda" className="inline-flex items-center" aria-label={`${BRAND.name} - Beranda`}>
              <Image
                src="/images/lmi-logo.png"
                alt="LMI Event - Lembaga Manajemen Infaq"
                width={144}
                height={70}
                className="h-auto w-32"
              />
            </Link>
            <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
              Platform tiket event paling ramah di Indonesia.
            </p>
          </div>

          {/* Column 2: Tentang Kami */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Tentang Kami</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              {ABOUT_LINKS.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="hover:text-white transition">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Informasi */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Informasi</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              {INFO_LINKS.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="hover:text-white transition">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Kategori Event */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Kategori Event</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              {CATEGORY_LINKS.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="hover:text-white transition">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Social Icons */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>{BRAND.copyright}</p>

          <div className="flex items-center gap-4">
            {SOCIAL_LINKS.map((soc) => (
              <a
                key={soc.name}
                href={soc.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={soc.name}
                className="text-slate-400 hover:text-white transition"
              >
                {soc.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
