"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Icon from "@/app/landing/Icon";
import Sidebar from "@/app/sidebar/Sidebar";
import notify from "@/lib/sweetalert";

export default function AdminDashboardLayout({ children }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(
    pathname.includes("/berita") ? "berita" : "overview"
  );

  const handleNotificationClick = () => {
    notify.alert({
      title: "Notifikasi Sistem",
      html: `
        <div style="text-align: left; font-size: 13px; line-height: 1.6;">
          <p style="margin-bottom: 8px;"><strong>3 EO Baru Menunggu Verifikasi:</strong><br/>Kolektif Nada, Jakarta Fest, dan Java Sound.</p>
          <hr style="margin: 8px 0; border: 0; border-top: 1px solid #e2e8f0;"/>
          <p style="color: #64748b;">Semua layanan tiket dan pembayaran online berjalan optimal tanpa gangguan.</p>
        </div>
      `,
      icon: "info",
    });
  };

  return (
    <div className="min-h-screen bg-[#F4F6F9] text-slate-800 flex font-sans selection:bg-brand-200 selection:text-brand-900">
      {/* 1. SIDEBAR (DARI FOLDER src/app/sidebar) */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeItem={activeItem}
        setActiveItem={setActiveItem}
      />

      {/* 2. MAIN VIEWPORT WRAPPER */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72 transition-all">
        {/* Topbar Header */}
        <header className="sticky top-0 z-30 h-20 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
              aria-label="Buka menu navigasi"
            >
              <Icon name="menu" className="w-5 h-5" />
            </button>

            <div>
              <h1 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                Panel Super Admin
              </h1>
              <p className="text-xs text-slate-500 hidden sm:block">
                Kendali penuh ekosistem event, tiket, dan penyelenggara
              </p>
            </div>
          </div>

          {/* Topbar Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* System Status Pill */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-[11px] font-bold text-emerald-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Sistem Normal</span>
            </div>

            {/* Notification Button */}
            <button
              type="button"
              onClick={handleNotificationClick}
              className="relative p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 transition"
              aria-label="Notifikasi sistem"
            >
              <Icon name="bell" className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white" />
            </button>

            {/* Profile Avatar Badge */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-brand-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                SA
              </div>
              <span className="text-xs font-bold text-slate-800 hidden sm:inline">Admin Pusat</span>
            </div>
          </div>
        </header>

        {/* Page Children Content */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
