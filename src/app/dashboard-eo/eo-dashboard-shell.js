"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Icon from "@/app/landing/Icon";
import Sidebar, { EO_NAV_ITEMS } from "@/app/sidebar/Sidebar";
import DashboardLoading from "@/components/layout/dashboard-loading";
import { userInitials } from "@/lib/session";
import { useRequireRole } from "@/lib/useRequireRole";
import {
  getEventById,
  getOrganization,
  getProfileStatus,
} from "@/app/dashboard-eo/_data/eo-dashboard-data";

const SECTION_TITLES = {
  overview: "Dashboard",
  events: "Acara Saya",
  transaksi: "Pesanan",
  payout: "Keuangan",
  laporan: "Laporan",
  berita: "Cerita Event",
  profil: "Profil Organisasi",
  bantuan: "Bantuan",
  panduan: "Panduan EO",
};

const NOTIFICATIONS = [
  { id: "n1", icon: "ticket", title: "12 tiket baru terjual hari ini", time: "5 menit lalu", href: "/dashboard-eo/transaksi" },
  { id: "n2", icon: "checkBadge", title: "Dokumen verifikasi disetujui", time: "1 jam lalu", href: "/dashboard-eo/profil" },
  { id: "n3", icon: "wallet", title: "Payout Rp 12.500.000 dicairkan", time: "Kemarin", href: "/dashboard-eo/pencairan" },
];

const EVENT_TAB_IDS = [
  "ringkasan",
  "info",
  "tiket",
  "pesanan",
  "peserta",
  "laporan",
  "pengaturan",
];

// Menu Tingkat 2: muncul di sidebar saat EO membuka salah satu acara.
function buildEventNavItems(eventId) {
  const base = `/dashboard-eo/event/${eventId}`;
  return [
    {
      title: "Navigasi",
      items: [
        { id: "events", label: "Acara Saya", href: "/dashboard-eo/events", icon: "arrowLeft" },
        { id: "berita", label: "Cerita Event", href: "/dashboard-eo/berita", icon: "news" },
      ],
    },
    {
      title: "Menu Acara",
      items: [
        { id: "ringkasan", label: "Ringkasan", href: base, icon: "dashboard" },
        { id: "info", label: "Info Acara", href: `${base}/info`, icon: "news" },
        { id: "tiket", label: "Tiket", href: `${base}/tiket`, icon: "ticket" },
        { id: "pesanan", label: "Pesanan", href: `${base}/pesanan`, icon: "creditCard" },
        { id: "peserta", label: "Peserta & Check-in", href: `${base}/peserta`, icon: "users" },
        { id: "laporan", label: "Laporan", href: `${base}/laporan`, icon: "chartBar" },
        { id: "pengaturan", label: "Pengaturan", href: `${base}/pengaturan`, icon: "cog" },
      ],
    },
  ];
}

export default function EODashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useRequireRole("organizer");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(
    pathname.includes("/berita") ? "berita" : "overview"
  );

  const eventMatch = pathname.match(
    /^\/dashboard-eo\/event\/([^/]+)(?:\/([^/]+))?/
  );
  const inEvent = Boolean(eventMatch);
  const eventId = eventMatch?.[1];
  const eventTab = eventMatch?.[2];

  const sidebarNavItems = inEvent ? buildEventNavItems(eventId) : EO_NAV_ITEMS;

  const sectionActiveItem = pathname.startsWith("/dashboard-eo/events")
    ? "events"
    : pathname.startsWith("/dashboard-eo/transaksi")
      ? "transaksi"
      : pathname.startsWith("/dashboard-eo/pencairan")
        ? "payout"
        : pathname.startsWith("/dashboard-eo/laporan")
          ? "laporan"
          : pathname.startsWith("/dashboard-eo/profil")
            ? "profil"
            : pathname.startsWith("/dashboard-eo/bantuan")
              ? "bantuan"
              : pathname.startsWith("/dashboard-eo/panduan")
                ? "panduan"
                : pathname.includes("/berita")
                  ? "berita"
                  : "overview";

  const sidebarActiveItem = inEvent
    ? EVENT_TAB_IDS.includes(eventTab)
      ? eventTab
      : "ringkasan"
    : sectionActiveItem;

  if (loading) {
    return <DashboardLoading label="Memuat panel EO..." />;
  }

  const displayName = user?.name || "Event Organizer";
  const displayEmail = user?.email || "eo@lmi.id";
  const avatar = userInitials(displayName, "EO");

  const orgProfile = getOrganization(user?.penyelenggaraId);
  const verificationStatus = getProfileStatus(orgProfile);
  const pageTitle = inEvent
    ? getEventById(eventId)?.title ?? "Detail Acara"
    : SECTION_TITLES[sectionActiveItem] ?? "Dashboard";

  const statusStyle =
    verificationStatus === "Terverifikasi"
      ? "bg-emerald-50 border-emerald-200 text-emerald-700"
      : verificationStatus === "Ditolak" || verificationStatus === "Kedaluwarsa"
        ? "bg-rose-50 border-rose-200 text-rose-700"
        : "bg-amber-50 border-amber-200 text-amber-700";
  const statusDot =
    verificationStatus === "Terverifikasi"
      ? "bg-emerald-500"
      : verificationStatus === "Ditolak" || verificationStatus === "Kedaluwarsa"
        ? "bg-rose-500"
        : "bg-amber-500";

  return (
    <div className="min-h-screen bg-[#F4F6F9] text-slate-800 flex font-sans selection:bg-brand-200 selection:text-brand-900">
      {/* 1. SIDEBAR (DARI FOLDER src/app/sidebar) */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeItem={sidebarActiveItem}
        setActiveItem={setActiveItem}
        navItems={sidebarNavItems}
        homeHref="/dashboard-eo"
        user={{
          name: displayName,
          caption: `PIC: ${orgProfile.picName || displayName}`,
          email: displayEmail,
          role: "EO Mitra",
          avatar,
        }}
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

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <Link href="/dashboard-eo" className="hover:text-brand-700">
                  Dashboard
                </Link>
                <span>/</span>
                <span className="truncate font-semibold text-slate-600">{pageTitle}</span>
              </div>
              <h1 className="truncate text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                {pageTitle}
              </h1>
              <p className="text-xs text-slate-500 hidden sm:block">
                Panel Event Organizer
              </p>
            </div>
          </div>

          {/* Topbar Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Status Akun Pill — klik menuju dokumen verifikasi */}
            <Link
              href="/dashboard-eo/profil#dokumen"
              className={`hidden md:flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-bold transition ${statusStyle}`}
              title="Lihat dokumen verifikasi"
            >
              <span className={`h-2 w-2 rounded-full ${statusDot}`} />
              {verificationStatus === "Terverifikasi"
                ? "EO Terverifikasi"
                : verificationStatus}
            </Link>

            {/* Notification Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setNotifOpen((prev) => !prev)}
                aria-expanded={notifOpen}
                aria-label="Notifikasi penyelenggara"
                title="Notifikasi"
                className="relative p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 transition"
              >
                <Icon name="bell" className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white" />
              </button>

              {notifOpen && (
                <div className="absolute right-0 top-12 z-40 w-80 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                  <div className="flex items-center justify-between px-2 py-1.5">
                    <p className="text-xs font-extrabold text-slate-900">Notifikasi</p>
                    <button
                      type="button"
                      onClick={() => setNotifOpen(false)}
                      aria-label="Tutup notifikasi"
                      className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
                    >
                      <Icon name="close" className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {NOTIFICATIONS.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setNotifOpen(false);
                          router.push(item.href);
                        }}
                        className="flex w-full items-start gap-3 px-2 py-3 text-left transition hover:bg-slate-50"
                      >
                        <span className="rounded-lg bg-brand-50 p-2 text-brand-700">
                          <Icon name={item.icon} className="h-4 w-4" />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-xs font-bold text-slate-800">
                            {item.title}
                          </span>
                          <span className="block text-[11px] text-slate-400">{item.time}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar Badge */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-brand-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                {avatar}
              </div>
              <span className="text-xs font-bold text-slate-800 hidden sm:inline truncate max-w-[160px]">
                {displayName}
              </span>
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



