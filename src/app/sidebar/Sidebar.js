"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Icon from "@/app/landing/Icon";
import notify from "@/lib/sweetalert";

export const ADMIN_NAV_ITEMS = [
  {
    title: "Menu Utama",
    items: [
      { id: "overview", label: "Ringkasan", href: "/dashboard-admin", icon: "dashboard" },
      { id: "events", label: "Kelola Event", href: "/dashboard-admin#events", icon: "ticket", badge: "48" },
      { id: "berita", label: "Kelola Berita", href: "/dashboard-admin/berita", icon: "news" },
      { id: "organizers", label: "Verifikasi EO", href: "/dashboard-admin#verifikasi-eo", icon: "building", badge: "3 Baru", badgeColor: "bg-amber-100 text-amber-700" },
      { id: "transactions", label: "Transaksi & Tiket", href: "/dashboard-admin#transaksi", icon: "chartBar" },
      { id: "users", label: "Data Pengguna", href: "/dashboard-admin#users", icon: "users" },
    ],
  },
  {
    title: "Sistem & Konfigurasi",
    items: [
      { id: "settings", label: "Pengaturan Platform", href: "/dashboard-admin#pengaturan", icon: "cog" },
    ],
  },
];

export const EO_NAV_ITEMS = [
  {
    title: "Menu Penyelenggara",
    items: [
      { id: "overview", label: "Ringkasan", href: "/organizer", icon: "dashboard" },
      { id: "events", label: "Event Saya", href: "/organizer#events", icon: "ticket" },
      { id: "berita", label: "Kelola Berita", href: "/organizer/berita", icon: "news" },
    ],
  },
  {
    title: "Bantuan",
    items: [
      { id: "panduan", label: "Panduan EO", href: "/organizer#panduan", icon: "shield" },
    ],
  },
];

export default function Sidebar({
  sidebarOpen = false,
  setSidebarOpen = () => {},
  activeItem = "overview",
  setActiveItem = () => {},
  navItems = ADMIN_NAV_ITEMS,
  user = {
    name: "Super Administrator",
    email: "admin@lmi.id",
    role: "Super Admin",
    avatar: "SA",
  },
}) {
  const router = useRouter();

  const handleLogout = async () => {
    const confirmed = await notify.confirm({
      title: "Keluar dari Dashboard?",
      text: "Anda akan keluar dari sesi Super Admin dan diarahkan ke halaman login.",
      confirmText: "Ya, Keluar",
      cancelText: "Batal",
      danger: true,
    });

    if (confirmed) {
      notify.toast("Berhasil keluar dari akun.");
      router.push("/authentication/login");
    }
  };

  return (
    <>
      {/* Backdrop Mobile Drawer */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm lg:hidden transition-opacity"
          aria-hidden="true"
          />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-slate-900 text-slate-300 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 border-r border-slate-800 ${
          sidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header / Logo */}
        <div>
          <div className="h-20 px-6 flex items-center justify-between border-b border-slate-800/80">
            <Link href="/dashboard-admin" className="flex items-center gap-2.5 group" aria-label="LMI Event - Beranda">
              <Image
                src="/images/lmi-logo.png"
                alt="LMI Event - Lembaga Manajemen Infaq"
                width={144}
                height={70}
                className="h-auto w-36 transition-transform group-hover:scale-105"
              />
            </Link>

            {/* Mobile close button */}
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              aria-label="Tutup menu navigasi"
            >
              <Icon name="close" className="w-5 h-5" />
            </button>
          </div>

          {/* Sidebar Nav Items */}
          <nav className="p-4 space-y-6 overflow-y-auto max-h-[calc(100vh-170px)]">
            {navItems.map((section, sIdx) => (
              <div key={sIdx} className="space-y-1.5">
                <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  {section.title}
                </p>
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const isActive = activeItem === item.id;
                    return (
                      <Link
                        key={item.id}
                        href={item.href}
                        onClick={() => {
                          setActiveItem(item.id);
                          setSidebarOpen(false);
                        }}
                        className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold text-xs transition-all group ${
                          isActive
                            ? "bg-brand-600 text-white shadow-md shadow-brand-600/25"
                            : "text-slate-400 hover:text-white hover:bg-slate-800/70"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon
                            name={item.icon}
                            className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                              isActive ? "text-white" : "text-slate-400 group-hover:text-white"
                            }`}
                          />
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span
                            className={`px-2 py-0.5 text-[10px] font-extrabold rounded-full ${
                              item.badgeColor || (isActive ? "bg-white/20 text-white" : "bg-slate-800 text-slate-300")
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Link Balik ke Web Publik */}
            <div className="pt-2 border-t border-slate-800/80">
              <Link
                href="/"
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-xs text-slate-400 hover:text-white hover:bg-slate-800/70 transition-all"
              >
                <Icon name="arrowLeft" className="w-4 h-4 text-slate-400" />
                <span>Lihat Web Pengunjung</span>
              </Link>
            </div>
          </nav>
        </div>

        {/* Sidebar Footer User Info */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-500 to-purple-600 flex items-center justify-center text-white font-extrabold text-sm shrink-0 shadow-inner">
                {user.avatar}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">{user.name}</p>
                <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition shrink-0"
              title="Keluar dari akun"
              aria-label="Logout"
            >
              <Icon name="logout" className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
