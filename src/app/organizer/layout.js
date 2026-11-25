"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Icon from "@/app/landing/Icon";
import Sidebar, { EO_NAV_ITEMS } from "@/app/sidebar/Sidebar";

const EO_USER = {
  name: "Event Organizer",
  email: "eo@lmi.id",
  role: "EO Mitra",
  avatar: "EO",
};

export default function OrganizerDashboardLayout({ children }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(
    pathname.includes("/berita") ? "berita" : "overview"
  );

  return (
    <div className="min-h-screen bg-[#F4F6F9] text-slate-800 flex font-sans selection:bg-brand-200 selection:text-brand-900">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeItem={activeItem}
        setActiveItem={setActiveItem}
        navItems={EO_NAV_ITEMS}
        user={EO_USER}
      />

      <div className="flex-1 flex flex-col min-w-0 lg:pl-72 transition-all">
        <header className="sticky top-0 z-30 h-20 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
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
                Panel Penyelenggara
              </h1>
              <p className="text-xs text-slate-500 hidden sm:block">
                Kelola event, tiket, dan cerita kemitraan Anda
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full bg-brand-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
              EO
            </div>
            <span className="text-xs font-bold text-slate-800 hidden sm:inline">Event Organizer</span>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
