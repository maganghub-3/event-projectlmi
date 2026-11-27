"use client";

import { useState } from "react";
import Link from "next/link";
import Icon from "@/app/landing/Icon";
import Button from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import notify from "@/lib/sweetalert";
import { escapeHtml } from "@/lib/auth-utils";
import { useRequireRole } from "@/lib/useRequireRole";
import {
  EO_DASHBOARD_SALES,
  EO_DEMOGRAPHICS,
  EO_FINANCE_SUMMARY,
  EO_PAYOUT_HISTORY,
  EO_TASKS,
  duplicateEvent,
  formatRupiah,
  getAttendeesSnapshot,
  getEventsSnapshot,
  getOrganization,
  getOrderStatus,
  getStatusLabel,
  getStatusVariant,
  setAttendeeCheckedIn,
  updateEvent,
} from "@/app/dashboard-eo/_data/eo-dashboard-data";
import { SalesChart } from "./event/[id]/event-panels";
import CreateEventWizard from "./create-event-wizard";
import ProfileView from "./profile-view";

function PageHeader({ label, title, description, children }) {
  return (
    <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <span className="inline-flex rounded-full bg-brand-50 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-brand-700 ring-1 ring-brand-200">
          {label}
        </span>
        <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
          {title}
        </h2>
        <p className="mt-1 text-xs text-slate-500 sm:text-sm">{description}</p>
      </div>
      {children && <div className="flex flex-wrap items-center gap-2.5">{children}</div>}
    </section>
  );
}

function MetricCards({ metrics }) {
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((m) => (
        <div
          key={m.title}
          className="space-y-3 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${m.iconBg}`}>
              <Icon name={m.icon} className="h-5 w-5" />
            </div>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-bold text-slate-700">
              {m.badge}
            </span>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">{m.title}</p>
            <p className="mt-1 text-xl font-black text-slate-900">{m.value}</p>
            <p className="mt-0.5 text-[11px] text-slate-400">{m.subtext}</p>
          </div>
        </div>
      ))}
    </section>
  );
}

export default function DashboardView({ section }) {
  const { user } = useRequireRole("organizer");
  const ownerId = user?.penyelenggaraId;

  const [events, setEvents] = useState(() => getEventsSnapshot(ownerId));
  const [attendees, setAttendees] = useState(() =>
    getAttendeesSnapshot().filter((row) =>
      events.some((ev) => ev.id === row.eventId)
    )
  );
  const [showWizard, setShowWizard] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [eventQuery, setEventQuery] = useState("");
  const [orderStatus, setOrderStatus] = useState("all");
  const [orderEvent, setOrderEvent] = useState("all");
  const [orderDate, setOrderDate] = useState("");
  const [tasks, setTasks] = useState(EO_TASKS);

  const totalSold = events.reduce((acc, ev) => acc + ev.sold, 0);
  const totalQuota = events.reduce((acc, ev) => acc + ev.quota, 0);
  const totalRevenue = events.reduce((acc, ev) => acc + ev.sold * ev.price, 0);
  const activeCount = events.filter((ev) => ev.status === "aktif").length;
  const totalBalance = events.reduce((acc, ev) => acc + (ev.balance || 0), 0);

  const eventTitleById = new Map(events.map((ev) => [ev.id, ev.title]));

  const refreshAttendees = () =>
    setAttendees(
      getAttendeesSnapshot().filter((row) =>
        events.some((ev) => ev.id === row.eventId)
      )
    );

  const handleToggleCheckIn = (orderId) => {
    const row = attendees.find((item) => item.id === orderId);
    if (!row) return;
    setAttendeeCheckedIn(orderId, !row.checkedIn);
    refreshAttendees();
    notify.toast(`Status check-in ${orderId} diperbarui`);
  };

  const handlePayout = async (event) => {
    if (event.balance <= 0) {
      notify.info("Event ini belum memiliki saldo untuk dicairkan.");
      return;
    }

    const confirmed = await notify.confirm({
      title: "Ajukan Pencairan Dana?",
      html: `<p>Dana sebesar <strong>${formatRupiah(event.balance)}</strong> dari event <strong>${escapeHtml(
        event.title
      )}</strong> akan ditransfer ke rekening BCA •••• 4821.</p>`,
      confirmText: "Ya, Cairkan",
      cancelText: "Batal",
    });

    if (confirmed) {
      updateEvent(event.id, { balance: 0 });
      setEvents(getEventsSnapshot(ownerId));
      notify.success(`Pencairan dana event "${event.title}" diajukan.`);
    }
  };

  const refreshEvents = () => setEvents(getEventsSnapshot(ownerId));

  const visibleEvents = events.filter((ev) => {
    const q = eventQuery.trim().toLowerCase();
    return (
      !q ||
      ev.title.toLowerCase().includes(q) ||
      ev.status.toLowerCase().includes(q) ||
      ev.city.toLowerCase().includes(q)
    );
  });

  const orderRows = attendees.filter((row) => {
    const q = searchQuery.trim().toLowerCase();
    const searchOk =
      !q ||
      row.name.toLowerCase().includes(q) ||
      row.id.toLowerCase().includes(q) ||
      row.email.toLowerCase().includes(q) ||
      (eventTitleById.get(row.eventId) ?? "").toLowerCase().includes(q);
    const statusOk =
      orderStatus === "all" || getOrderStatus(row) === orderStatus;
    const eventOk = orderEvent === "all" || row.eventId === orderEvent;
    const dateOk =
      !orderDate || row.orderDate.toLowerCase().includes(orderDate.toLowerCase());
    return searchOk && statusOk && eventOk && dateOk;
  });

  const handleDuplicate = (event) => {
    duplicateEvent(event.id);
    refreshEvents();
    notify.toast(`Acara "${event.title}" diduplikat sebagai draft.`);
  };

  const handleCloseSales = async (event) => {
    const confirmed = await notify.confirm({
      title: "Tutup Penjualan?",
      html: `<p>Penjualan tiket <strong>${escapeHtml(event.title)}</strong> akan dihentikan.</p>`,
      confirmText: "Ya, Tutup",
      cancelText: "Batal",
      danger: true,
    });
    if (confirmed) {
      updateEvent(event.id, { status: "ditutup" });
      refreshEvents();
      notify.success("Penjualan tiket ditutup.");
    }
  };

  const exportOrdersCSV = () => {
    const header = ["Kode", "Tanggal", "Pembeli", "Email", "Acara", "Tiket", "Total", "Status"];
    const rows = orderRows.map((row) => [
      row.id,
      row.orderDate,
      row.name,
      row.email,
      eventTitleById.get(row.eventId) ?? "-",
      row.qty,
      row.total,
      getOrderStatus(row),
    ]);
    const csv = [header, ...rows]
      .map((line) => line.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "laporan-pesanan-eo.csv";
    link.click();
    URL.revokeObjectURL(url);
    notify.toast("Laporan pesanan diekspor ke CSV.");
  };

  const wizard = showWizard ? (
    <CreateEventWizard
      onClose={() => setShowWizard(false)}
      onCreated={setEvents}
    />
  ) : null;

  const createButton = (
    <Button
      variant="primary"
      size="md"
      rounded="xl"
      onClick={() => setShowWizard((prev) => !prev)}
    >
      {showWizard ? "Tutup Wizard" : "+ Buat Acara Baru"}
    </Button>
  );

  const metrics = [
    {
      title: "Total Pendapatan Tiket",
      value: formatRupiah(totalRevenue),
      badge: "+18.4%",
      subtext: "dari seluruh penjualan",
      icon: "creditCard",
      iconBg: "bg-emerald-100 text-emerald-700",
    },
    {
      title: "Total Tiket Terjual",
      value: `${totalSold.toLocaleString("id-ID")} Tiket`,
      badge: `${Math.round((totalSold / Math.max(totalQuota, 1)) * 100)}% kuota`,
      subtext: `dari ${totalQuota.toLocaleString("id-ID")} kapasitas`,
      icon: "ticket",
      iconBg: "bg-brand-100 text-brand-700",
    },
    {
      title: "Event Aktif",
      value: `${activeCount} Event`,
      badge: `${events.length} total`,
      subtext: "sedang tayang",
      icon: "dashboard",
      iconBg: "bg-purple-100 text-purple-700",
    },
    {
      title: "Total Saldo Semua Event",
      value: formatRupiah(totalBalance),
      badge: totalBalance > 0 ? "Siap Cair" : "Diproses",
      subtext: "pencairan dilakukan per event",
      icon: "building",
      iconBg: "bg-amber-100 text-amber-700",
    },
  ];

  /* ------------------------------- RINGKASAN ------------------------------ */
  if (section === "ringkasan") {
    return (
      <div className="space-y-8">
        <PageHeader
          label="Dashboard Event Organizer"
          title="Ringkasan Performa Event Anda"
          description="Pantau penjualan tiket, event aktif, dan saldo penjualan Anda."
        >
          <Button variant="outline" size="md" rounded="xl" href="/dashboard-eo/berita">
            Cerita Event
          </Button>
          {createButton}
        </PageHeader>

        {wizard}
        <MetricCards metrics={metrics} />

        <section className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">Event Terbaru</h3>
              <p className="text-xs text-slate-500">Acara yang sedang Anda kelola.</p>
            </div>
            <Button variant="link" size="sm" rounded="lg" href="/dashboard-eo/events">
              Lihat semua
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {events.slice(0, 2).map((ev) => (
              <Link
                key={ev.id}
                href={`/dashboard-eo/event/${ev.id}`}
                className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/60 p-4 transition hover:border-brand-300"
              >
                <div>
                  <p className="text-sm font-extrabold text-slate-900">{ev.title}</p>
                  <p className="text-xs text-slate-500">
                    {ev.date} • {ev.sold} / {ev.quota} tiket
                  </p>
                </div>
                <Icon name="arrowRight" className="h-4 w-4 text-brand-600" />
              </Link>
            ))}
            {events.length === 0 && (
              <p className="text-xs text-slate-400">Belum ada acara yang dibuat.</p>
            )}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">Grafik Penjualan</h3>
              <p className="text-xs text-slate-500">Penjualan tiket lintas acara beberapa hari terakhir.</p>
            </div>
            <Button variant="link" size="sm" rounded="lg" href="/dashboard-eo/laporan">
              Lihat laporan
            </Button>
          </div>
          <SalesChart data={EO_DASHBOARD_SALES} />
        </section>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <section className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-extrabold text-slate-900">Pesanan Terbaru</h3>
            <p className="text-xs text-slate-500">Pesanan masuk dari seluruh acara.</p>
            <div className="mt-4 divide-y divide-slate-100">
              {attendees.slice(0, 4).map((row) => (
                <div key={row.id} className="flex items-center justify-between py-3 text-xs">
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900">{row.name}</p>
                    <p className="truncate text-[11px] text-slate-400">
                      {row.id} • {eventTitleById.get(row.eventId) ?? "-"}
                    </p>
                  </div>
                  <span className="font-bold text-slate-800">{formatRupiah(row.total)}</span>
                </div>
              ))}
            </div>
            <Button variant="link" size="sm" rounded="lg" href="/dashboard-eo/transaksi" className="mt-2">
              Semua pesanan
            </Button>
          </section>

          <section className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-extrabold text-slate-900">Daftar Tugas</h3>
            <p className="text-xs text-slate-500">Yang perlu dilengkapi penyelenggara.</p>
            <div className="mt-4 space-y-2">
              {tasks.map((task) => (
                <label
                  key={task.id}
                  className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/60 p-3 text-xs"
                >
                  <input
                    type="checkbox"
                    checked={task.done}
                    onChange={() =>
                      setTasks((prev) =>
                        prev.map((item) =>
                          item.id === task.id ? { ...item, done: !item.done } : item
                        )
                      )
                    }
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-brand-600"
                  />
                  <span className={task.done ? "text-slate-400 line-through" : "font-semibold text-slate-700"}>
                    {task.label}
                  </span>
                </label>
              ))}
            </div>
          </section>
        </div>
      </div>
    );
  }

  /* ------------------------------ EVENT SAYA ------------------------------ */
  if (section === "events") {
    return (
      <div className="space-y-8">
        <PageHeader
          label="Acara Saya"
          title="Kelola Acara Anda"
          description="Buka salah satu acara untuk mengelola tiket, pesanan, peserta, dan laporan."
        >
          {createButton}
        </PageHeader>

        {wizard}

        <div className="max-w-sm">
          <Input
            type="search"
            placeholder="Cari acara atau status..."
            value={eventQuery}
            onChange={(e) => setEventQuery(e.target.value)}
            className="h-10 rounded-xl text-xs"
            aria-label="Cari acara"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {visibleEvents.map((ev) => {
            const pct = Math.min(100, Math.round((ev.sold / Math.max(ev.quota, 1)) * 100));
            return (
              <div
                key={ev.id}
                className="space-y-4 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm transition hover:border-brand-300 hover:shadow-md"
              >
                <Link href={`/dashboard-eo/event/${ev.id}`} className="group block space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-brand-700">
                        {ev.category}
                      </span>
                      <h3 className="text-base font-extrabold text-slate-900">{ev.title}</h3>
                      <p className="text-xs text-slate-500">
                        {ev.date} • {ev.venue}, {ev.city}
                      </p>
                    </div>
                    <Badge variant={getStatusVariant(ev.status)}>
                      {getStatusLabel(ev.status)}
                    </Badge>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-600">
                        Tiket Terjual: {ev.sold} / {ev.quota}
                      </span>
                      <span className="font-bold text-brand-700">{pct}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-brand-600 to-brand-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-200/70 pt-2 text-xs">
                    <span className="text-slate-400">
                      Harga: <strong className="text-slate-800">{formatRupiah(ev.price)}</strong>
                    </span>
                    <span className="text-slate-400">
                      Omzet: <strong className="text-emerald-700">{formatRupiah(ev.sold * ev.price)}</strong>
                    </span>
                  </div>

                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-700">
                    Kelola acara
                    <Icon name="arrowRight" className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>

                <div className="flex flex-wrap items-center gap-2 border-t border-slate-200/70 pt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    rounded="lg"
                    href={`/dashboard-eo/event/${ev.id}/info`}
                  >
                    Ubah
                  </Button>
                  <Button variant="ghost" size="sm" rounded="lg" onClick={() => handleDuplicate(ev)}>
                    Gandakan
                  </Button>
                  {ev.status === "aktif" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      rounded="lg"
                      onClick={() => handleCloseSales(ev)}
                    >
                      Tutup Penjualan
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
          {visibleEvents.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-xs text-slate-400">
              Belum ada acara yang cocok. Klik &quot;+ Buat Acara Baru&quot; untuk memulai.
            </div>
          )}
        </div>
      </div>
    );
  }

  /* -------------------------- PENJUALAN & PESERTA ------------------------- */
  if (section === "transaksi") {
    return (
      <div className="space-y-8">
        <PageHeader
          label="Pesanan"
          title="Semua Pesanan"
          description="Pesanan dari seluruh acara, lengkap dengan filter status, tanggal, dan acara."
        />

        <section className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm">
          <div className="mb-5 space-y-3">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">Daftar Pesanan</h3>
              <p className="text-xs text-slate-500">Cari dan saring pesanan masuk.</p>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Input
                type="search"
                placeholder="Cari nama, kode order, event..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 rounded-xl text-xs"
                aria-label="Cari pesanan"
              />
              <select
                value={orderStatus}
                onChange={(e) => setOrderStatus(e.target.value)}
                className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs"
                aria-label="Filter status pesanan"
              >
                <option value="all">Semua status</option>
                <option value="DIBAYAR">Dibayar</option>
                <option value="MENUNGGU">Menunggu</option>
                <option value="DIBATALKAN">Dibatalkan</option>
              </select>
              <select
                value={orderEvent}
                onChange={(e) => setOrderEvent(e.target.value)}
                className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs"
                aria-label="Filter acara"
              >
                <option value="all">Semua acara</option>
                {events.map((ev) => (
                  <option key={ev.id} value={ev.id}>
                    {ev.title}
                  </option>
                ))}
              </select>
              <Input
                type="text"
                placeholder="Cari tanggal (contoh: Des)"
                value={orderDate}
                onChange={(e) => setOrderDate(e.target.value)}
                className="h-10 rounded-xl text-xs"
                aria-label="Filter tanggal pesanan"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-3 pr-4">Kode</th>
                  <th className="py-3 pr-4">Pembeli</th>
                  <th className="py-3 pr-4">Event</th>
                  <th className="py-3 pr-4">Tiket</th>
                  <th className="py-3 pr-4">Total</th>
                  <th className="py-3 pr-4">Status</th>
                  <th className="py-3 pr-4">Check-in</th>
                  <th className="py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orderRows.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/70">
                    <td className="py-3.5 pr-4 font-mono font-bold text-slate-700">{row.id}</td>
                    <td className="py-3.5 pr-4">
                      <div className="font-bold text-slate-900">{row.name}</div>
                      <div className="text-[11px] text-slate-400">{row.email}</div>
                    </td>
                    <td className="py-3.5 pr-4">
                      <Link
                        href={`/dashboard-eo/event/${row.eventId}`}
                        className="text-slate-600 hover:text-brand-700 hover:underline"
                      >
                        {eventTitleById.get(row.eventId) ?? "-"}
                      </Link>
                    </td>
                    <td className="py-3.5 pr-4 font-semibold text-slate-700">{row.qty} tiket</td>
                    <td className="py-3.5 pr-4 font-bold text-slate-900">
                      {formatRupiah(row.total)}
                    </td>
                    <td className="py-3.5 pr-4">
                      <Badge
                        variant={
                          getOrderStatus(row) === "DIBAYAR"
                            ? "success"
                            : getOrderStatus(row) === "MENUNGGU"
                              ? "warning"
                              : "secondary"
                        }
                      >
                        {getOrderStatus(row)}
                      </Badge>
                    </td>
                    <td className="py-3.5 pr-4">
                      <Badge variant={row.checkedIn ? "success" : "warning"}>
                        {row.checkedIn ? "Sudah Hadir" : "Belum Check-in"}
                      </Badge>
                    </td>
                    <td className="py-3.5 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        rounded="lg"
                        onClick={() => handleToggleCheckIn(row.id)}
                      >
                        {row.checkedIn ? "Batalkan" : "Tandai Hadir"}
                      </Button>
                    </td>
                  </tr>
                ))}
                {orderRows.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-xs text-slate-400">
                      Tidak ada pesanan yang cocok dengan filter Anda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    );
  }

  /* -------------------------------- KEUANGAN ------------------------------ */
  if (section === "pencairan") {
    const bank = getOrganization(ownerId)?.bank ?? EO_FINANCE_SUMMARY.bank;

    return (
      <div className="space-y-8">
        <PageHeader
          label="Keuangan"
          title="Keuangan & Penarikan Dana"
          description="Pantau saldo, ajukan penarikan, dan lihat riwayat pencairan dana."
        />

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { label: "Saldo Tersedia", value: formatRupiah(totalBalance), tone: "text-emerald-700", sub: "siap dicairkan" },
            { label: "Saldo Tertahan", value: formatRupiah(EO_FINANCE_SUMMARY.held), tone: "text-amber-700", sub: "menunggu verifikasi" },
            { label: "Biaya Layanan", value: `${EO_FINANCE_SUMMARY.serviceFeePercent}%`, tone: "text-slate-900", sub: "dari setiap transaksi" },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold text-slate-500">{item.label}</p>
              <p className={`mt-1 text-2xl font-black ${item.tone}`}>{item.value}</p>
              <p className="mt-0.5 text-[11px] text-slate-400">{item.sub}</p>
            </div>
          ))}
        </section>

        <section className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-extrabold text-slate-900">Ajukan Penarikan per Acara</h3>
          <p className="text-xs text-slate-500">Saldo penjualan tiket dicairkan dari masing-masing acara.</p>
          <div className="mt-4 space-y-3">
            {events.map((ev) => (
              <div
                key={ev.id}
                className="flex flex-col gap-4 rounded-2xl border border-slate-200/90 bg-slate-50/50 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm font-extrabold text-slate-900">{ev.title}</p>
                  <p className="text-xs text-slate-500">
                    Saldo acara: <strong className="text-slate-800">{formatRupiah(ev.balance || 0)}</strong>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    rounded="lg"
                    onClick={() => handlePayout(ev)}
                    disabled={(ev.balance || 0) <= 0}
                  >
                    Ajukan Pencairan
                  </Button>
                  <Button variant="outline" size="sm" rounded="lg" href={`/dashboard-eo/event/${ev.id}`}>
                    Detail
                  </Button>
                </div>
              </div>
            ))}
            {events.length === 0 && (
              <p className="text-xs text-slate-400">Belum ada acara dengan saldo.</p>
            )}
          </div>
        </section>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <section className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-extrabold text-slate-900">Riwayat Payout</h3>
            <p className="text-xs text-slate-500">Penarikan dana yang pernah diajukan.</p>
            <div className="mt-4 divide-y divide-slate-100">
              {EO_PAYOUT_HISTORY.map((row) => (
                <div key={row.id} className="flex items-center justify-between gap-3 py-3 text-xs">
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900">{row.id}</p>
                    <p className="truncate text-[11px] text-slate-400">{row.event} • {row.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-900">{formatRupiah(row.amount)}</p>
                    <Badge variant={row.status === "DICAIRKAN" ? "success" : "warning"}>
                      {row.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="space-y-6">
            <section className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-extrabold text-slate-900">Rincian Biaya Layanan</h3>
              <div className="mt-4 space-y-2 text-xs">
                {[
                  ["Biaya platform", `${EO_FINANCE_SUMMARY.serviceFeePercent}%`],
                  ["Biaya gateway pembayaran", "2%"],
                  ["Biaya administrasi", "Rp 2.000 / pesanan"],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-slate-500">{label}</span>
                    <strong className="text-slate-800">{value}</strong>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-extrabold text-slate-900">Data Rekening</h3>
                <Button variant="link" size="sm" rounded="lg" href="/dashboard-eo/profil">
                  Ubah
                </Button>
              </div>
              <div className="mt-3 space-y-1 text-xs text-slate-600">
                <p><strong className="text-slate-800">{bank?.name || "-"}</strong> • {bank?.number || "-"}</p>
                <p>a.n. {bank?.holder || "-"}</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  }

  /* -------------------------------- LAPORAN ------------------------------- */
  if (section === "laporan") {
    return (
      <div className="space-y-8">
        <PageHeader
          label="Laporan"
          title="Laporan Penjualan Lintas Acara"
          description="Ringkasan performa seluruh acara, demografi pembeli, dan ekspor data."
        >
          <Button variant="outline" rounded="xl" onClick={exportOrdersCSV}>
            Ekspor CSV
          </Button>
          <Button variant="primary" rounded="xl" onClick={() => window.print()}>
            Cetak / PDF
          </Button>
        </PageHeader>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Total Pendapatan", value: formatRupiah(totalRevenue) },
            { label: "Tiket Terjual", value: `${totalSold} tiket` },
            { label: "Total Pesanan", value: `${attendees.length} pesanan` },
            { label: "Jumlah Acara", value: `${events.length} acara` },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold text-slate-500">{item.label}</p>
              <p className="mt-1 text-xl font-black text-slate-900">{item.value}</p>
            </div>
          ))}
        </section>

        <section className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-extrabold text-slate-900">Grafik Penjualan Lintas Acara</h3>
          <p className="text-xs text-slate-500">Penjualan tiket dan pendapatan harian.</p>
          <div className="mt-4">
            <SalesChart data={EO_DASHBOARD_SALES} />
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-extrabold text-slate-900">Demografi Pembeli</h3>
          <p className="text-xs text-slate-500">Distribusi pembeli berdasarkan data contoh.</p>
          <div className="mt-5 grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              { title: "Kota", data: EO_DEMOGRAPHICS.cities },
              { title: "Usia", data: EO_DEMOGRAPHICS.ages },
              { title: "Metode Bayar", data: EO_DEMOGRAPHICS.payments },
            ].map((group) => (
              <div key={group.title} className="space-y-3">
                <p className="text-xs font-bold text-slate-700">{group.title}</p>
                {group.data.map((item) => (
                  <div key={item.label} className="space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-600">{item.label}</span>
                      <span className="font-bold text-slate-800">{item.value}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-slate-200">
                      <div
                        className="h-full rounded-full bg-brand-600"
                        style={{ width: `${item.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  /* --------------------------- PROFIL ORGANISASI -------------------------- */
  if (section === "profil") {
    return <ProfileView ownerId={ownerId} actorName={user?.name} />;
  }
  /* -------------------------------- BANTUAN ------------------------------- */
  if (section === "bantuan") {
    const faqs = [
      {
        q: "Bagaimana cara membuat acara baru?",
        a: "Buka menu Acara Saya, klik '+ Buat Acara Baru', lalu ikuti empat langkah: info dasar, tiket, pratinjau, dan publikasi. Draft tersimpan otomatis di setiap langkah.",
      },
      {
        q: "Di mana saya melihat penjualan tiket?",
        a: "Buka menu Ringkasan untuk grafik lintas acara, atau buka salah satu acara lalu pilih menu Ringkasan / Laporan di sidebar.",
      },
      {
        q: "Bagaimana cara mencairkan dana?",
        a: "Buka menu Keuangan, lalu klik 'Ajukan Pencairan' pada acara yang saldonya tersedia. Riwayat penarikan juga tersedia di halaman yang sama.",
      },
      {
        q: "Bagaimana cara menggandakan acara?",
        a: "Pada menu Acara Saya, klik tombol 'Gandakan' pada kartu acara. Salinan akan tersimpan sebagai draft.",
      },
    ];

    return (
      <div className="space-y-8">
        <PageHeader
          label="Bantuan"
          title="Pusat Bantuan Penyelenggara"
          description="Jawaban atas pertanyaan yang paling sering diajukan EO."
        />

        <section className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm">
          <div className="divide-y divide-slate-100">
            {faqs.map((faq) => (
              <details key={faq.q} className="group py-4">
                <summary className="flex cursor-pointer items-center justify-between gap-4 text-sm font-bold text-slate-800">
                  {faq.q}
                  <Icon name="chevronDown" className="h-4 w-4 shrink-0 text-slate-400 transition group-open:rotate-180" />
                </summary>
                <p className="mt-3 text-xs leading-relaxed text-slate-500">{faq.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-brand-200 bg-brand-50/60 p-6">
          <h3 className="text-lg font-extrabold text-slate-900">Masih butuh bantuan?</h3>
          <p className="mt-1 text-xs text-slate-600">
            Hubungi tim LMI melalui halaman Hubungi Kami.
          </p>
          <Button variant="primary" rounded="xl" href="/hubungi-kami" className="mt-4">
            Hubungi Kami
          </Button>
        </section>
      </div>
    );
  }

  /* -------------------------------- PANDUAN ------------------------------- */
  return (
    <div className="space-y-8">
      <PageHeader
        label="Panduan EO"
        title="Alur Sukses Penyelenggaraan Event"
        description="Langkah singkat mengelola acara dari pembuatan hingga pencairan dana."
      />

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {[
          {
            icon: "news",
            title: "1. Siapkan Acara",
            text: "Buat acara lewat wizard 4 langkah: info dasar, tiket, pratinjau, lalu publikasikan.",
            href: "/dashboard-eo/events",
            action: "Kelola Acara",
          },
          {
            icon: "ticket",
            title: "2. Atur Tiket",
            text: "Tentukan jenis tiket, harga, kuota, dan periode penjualan pada menu Tiket di dalam acara.",
            href: "/dashboard-eo/events",
            action: "Lihat Acara",
          },
          {
            icon: "users",
            title: "3. Check-in Peserta",
            text: "Gunakan menu Peserta & Check-in untuk memvalidasi e-ticket dan menandai kehadiran.",
            href: "/dashboard-eo/transaksi",
            action: "Lihat Peserta",
          },
          {
            icon: "wallet",
            title: "4. Cairkan Dana",
            text: "Setelah acara selesai, ajukan pencairan saldo dari menu Pencairan Dana.",
            href: "/dashboard-eo/pencairan",
            action: "Pencairan Dana",
          },
        ].map((item) => (
          <div key={item.title} className="space-y-3 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 text-brand-700">
              <Icon name={item.icon} className="h-5 w-5" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900">{item.title}</h3>
            <p className="text-xs leading-relaxed text-slate-500">{item.text}</p>
            <Button variant="link" size="sm" rounded="lg" href={item.href}>
              {item.action}
            </Button>
          </div>
        ))}
      </section>
    </div>
  );
}
