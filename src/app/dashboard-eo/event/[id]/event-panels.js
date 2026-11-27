"use client";

import { useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import Icon from "@/app/landing/Icon";
import Button from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  ChartContainer,
  ChartLegend,
  ChartTooltip,
} from "@/components/ui/chart";
import notify from "@/lib/sweetalert";
import {
  formatRupiah,
  getEventStats,
  getStatusLabel,
  getStatusVariant,
} from "@/app/dashboard-eo/_data/eo-dashboard-data";

export function SalesChart({ data }) {
  if (!data?.length) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-slate-200 text-xs text-slate-400">
        Belum ada penjualan harian untuk acara ini.
      </div>
    );
  }

  return (
    <ChartContainer height={300}>
      <AreaChart data={data} margin={{ top: 12, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4f46e5" stopOpacity={0.4} />
            <stop offset="100%" stopColor="#4f46e5" stopOpacity={0.02} />
          </linearGradient>
        </defs>

        <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" vertical={false} />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tick={{ fill: "#94a3b8", fontSize: 11 }}
          dy={8}
        />
        <YAxis
          yAxisId="tickets"
          tickLine={false}
          axisLine={false}
          tick={{ fill: "#94a3b8", fontSize: 11 }}
          width={44}
          allowDecimals={false}
        />
        <YAxis
          yAxisId="revenue"
          orientation="right"
          tickLine={false}
          axisLine={false}
          tick={{ fill: "#94a3b8", fontSize: 11 }}
          tickFormatter={(value) => `${Math.round(value / 1000000)} jt`}
          width={52}
        />

        <ChartTooltip
          formatter={(value, entry) =>
            entry.dataKey === "revenue" ? formatRupiah(value) : `${value} tiket`
          }
        />
        <ChartLegend
          verticalAlign="top"
          height={30}
          iconType="circle"
          wrapperStyle={{ fontSize: 11, color: "#64748b" }}
        />

        <Area
          yAxisId="tickets"
          type="monotone"
          dataKey="sold"
          name="Tiket terjual"
          stroke="#4f46e5"
          strokeWidth={3}
          fill="url(#salesGradient)"
          activeDot={{ r: 5, fill: "#4f46e5" }}
        />
        <Area
          yAxisId="revenue"
          type="monotone"
          dataKey="revenue"
          name="Pendapatan"
          stroke="#db510cff"
          strokeWidth={2}
          strokeDasharray="5 4"
          fill="none"
          activeDot={{ r: 4, fill: "#b93506ff" }}
        />
      </AreaChart>
    </ChartContainer>
  );
}

function SectionCard({ title, subtitle, children }) {
  return (
    <section className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm">
      <div className="mb-5">
        <h3 className="text-lg font-extrabold text-slate-900">{title}</h3>
        {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}

const TICKET_STATUS_VARIANT = {
  valid: "warning",
  ditukar: "secondary",
  "sudah masuk": "success",
};

export function RingkasanPanel({ event, attendees, onToggleCheckIn }) {
  const stats = getEventStats(event);
  const checkedIn = attendees.filter((row) => row.checkedIn).length;
  const recent = attendees.slice(0, 4);

  const metrics = [
    {
      title: "Penjualan",
      value: formatRupiah(stats.revenue),
      subtext: `${event.sold.toLocaleString("id-ID")} tiket terjual`,
      icon: "creditCard",
      iconBg: "bg-emerald-100 text-emerald-700",
    },
    {
      title: "Kuota Tersisa",
      value: `${stats.remaining.toLocaleString("id-ID")} tiket`,
      subtext: `dari ${event.quota.toLocaleString("id-ID")} kuota`,
      icon: "ticket",
      iconBg: "bg-brand-100 text-brand-700",
    },
    {
      title: "Check-in",
      value: `${checkedIn} pesanan`,
      subtext: `dari ${attendees.length} pesanan masuk`,
      icon: "users",
      iconBg: "bg-purple-100 text-purple-700",
    },
    {
      title: "Saldo Event",
      value: formatRupiah(event.balance),
      subtext: "siap dicairkan",
      icon: "wallet",
      iconBg: "bg-amber-100 text-amber-700",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m) => (
          <div
            key={m.title}
            className="space-y-3 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm"
          >
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${m.iconBg}`}>
              <Icon name={m.icon} className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">{m.title}</p>
              <p className="mt-1 text-xl font-black text-slate-900">{m.value}</p>
              <p className="mt-0.5 text-[11px] text-slate-400">{m.subtext}</p>
            </div>
          </div>
        ))}
      </div>

      <SectionCard
        title="Grafik Penjualan Harian"
        subtitle={`Penjualan tiket ${event.title} beberapa hari terakhir.`}
      >
        <SalesChart data={event.dailySales} />
      </SectionCard>

      <SectionCard
        title="Pesanan Terbaru"
        subtitle="Beberapa pesanan terakhir untuk acara ini."
      >
        <div className="divide-y divide-slate-100">
          {recent.map((row) => (
            <div key={row.id} className="flex items-center justify-between py-3 text-xs">
              <div>
                <p className="font-bold text-slate-900">{row.name}</p>
                <p className="text-[11px] text-slate-400">
                  {row.id} • {row.ticketType}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-slate-800">{formatRupiah(row.total)}</span>
                <Button
                  size="sm"
                  variant="outline"
                  rounded="lg"
                  onClick={() => onToggleCheckIn(row.id)}
                >
                  {row.checkedIn ? "Batalkan" : "Tandai Hadir"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

export function InfoPanel({ event }) {
  return (
    <div className="space-y-6">
      <SectionCard title="Detail Acara" subtitle="Informasi utama yang ditampilkan ke peserta.">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-[280px_1fr]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={event.poster}
            alt={`Poster ${event.title}`}
            className="h-52 w-full rounded-2xl object-cover"
          />
          <div className="space-y-4 text-sm">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-700">
                {event.category}
              </span>
              <h3 className="mt-1 text-xl font-black text-slate-900">{event.title}</h3>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex items-start gap-2 text-slate-600">
                <Icon name="calendar" className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-start gap-2 text-slate-600">
                <Icon name="clock" className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                <span>Masa jual: {event.saleStart} — {event.saleEnd}</span>
              </div>
              <div className="flex items-start gap-2 text-slate-600 sm:col-span-2">
                <Icon name="mapPin" className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                <span>
                  {event.venue}, {event.city}
                  <br />
                  <span className="text-xs text-slate-400">{event.address}</span>
                </span>
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-700">Deskripsi</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">{event.description}</p>
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Syarat dan Ketentuan" subtitle="Aturan yang berlaku bagi peserta acara.">
        <ol className="space-y-2 text-xs leading-relaxed text-slate-600">
          {event.terms.map((term, idx) => (
            <li key={term} className="flex gap-2">
              <span className="font-bold text-brand-700">{idx + 1}.</span>
              <span>{term}</span>
            </li>
          ))}
        </ol>
      </SectionCard>
    </div>
  );
}

export function TiketPanel({ event }) {
  return (
    <SectionCard
      title="Jenis Tiket"
      subtitle="Harga, kuota, periode penjualan, dan tiket terjual per hari."
    >
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <th className="py-3 pr-4">Jenis Tiket</th>
              <th className="py-3 pr-4">Harga</th>
              <th className="py-3 pr-4">Kuota</th>
              <th className="py-3 pr-4">Periode Jual</th>
              <th className="py-3">Tiket Harian</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {event.ticketTypes.map((ticket) => {
              const pct = Math.min(100, Math.round((ticket.sold / Math.max(ticket.quota, 1)) * 100));
              return (
                <tr key={ticket.id} className="hover:bg-slate-50/70">
                  <td className="py-3.5 pr-4 font-bold text-slate-900">{ticket.name}</td>
                  <td className="py-3.5 pr-4 font-semibold text-slate-700">
                    {formatRupiah(ticket.price)}
                  </td>
                  <td className="py-3.5 pr-4 text-slate-600">
                    {ticket.sold} / {ticket.quota}
                  </td>
                  <td className="py-3.5 pr-4 text-slate-600">
                    <span className="block">{ticket.saleStart}</span>
                    <span className="text-[11px] text-slate-400">s/d {ticket.saleEnd}</span>
                  </td>
                  <td className="py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-slate-200">
                        <div
                          className="h-full rounded-full bg-brand-600"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-[11px] font-bold text-brand-700">{pct}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </SectionCard>
  );
}

export function PesananPanel({ event, attendees }) {
  const [query, setQuery] = useState("");
  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return attendees;
    return attendees.filter(
      (row) =>
        row.id.toLowerCase().includes(q) ||
        row.name.toLowerCase().includes(q) ||
        row.email.toLowerCase().includes(q)
    );
  }, [attendees, query]);

  return (
    <SectionCard
      title="Pesanan Acara Ini"
      subtitle={`Seluruh pesanan untuk ${event.title}.`}
    >
      <div className="mb-4 max-w-xs">
        <Input
          type="search"
          placeholder="Cari kode order atau pembeli..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-10 rounded-xl text-xs"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <th className="py-3 pr-4">Kode</th>
              <th className="py-3 pr-4">Tanggal</th>
              <th className="py-3 pr-4">Pembeli</th>
              <th className="py-3 pr-4">Jenis Tiket</th>
              <th className="py-3 pr-4">Total</th>
              <th className="py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50/70">
                <td className="py-3.5 pr-4 font-mono font-bold text-slate-700">{row.id}</td>
                <td className="py-3.5 pr-4 text-slate-500">{row.orderDate}</td>
                <td className="py-3.5 pr-4">
                  <div className="font-bold text-slate-900">{row.name}</div>
                  <div className="text-[11px] text-slate-400">{row.email}</div>
                </td>
                <td className="py-3.5 pr-4 text-slate-600">
                  {row.ticketType} • {row.qty} tiket
                </td>
                <td className="py-3.5 pr-4 font-bold text-slate-900">
                  {formatRupiah(row.total)}
                </td>
                <td className="py-3.5">
                  <Badge variant="success">Dibayar</Badge>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-xs text-slate-400">
                  Tidak ada pesanan yang cocok.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </SectionCard>
  );
}

export function PesertaPanel({ event, attendees, onToggleCheckIn }) {
  const [query, setQuery] = useState("");
  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return attendees;
    return attendees.filter(
      (row) =>
        row.name.toLowerCase().includes(q) ||
        row.id.toLowerCase().includes(q) ||
        row.email.toLowerCase().includes(q)
    );
  }, [attendees, query]);

  const handleExport = () => {
    const header = ["Kode", "Nama", "Email", "Jenis Tiket", "Status", "Check-in"];
    const body = attendees.map((row) => [
      row.id,
      row.name,
      row.email,
      row.ticketType,
      row.ticketStatus,
      row.checkedIn ? "Sudah masuk" : "Belum",
    ]);
    const csv = [header, ...body]
      .map((line) => line.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `peserta-${event.id}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    notify.toast("Data peserta berhasil diekspor.");
  };

  return (
    <SectionCard
      title="Peserta & Check-in"
      subtitle="Daftar pemegang tiket, status tiket, pantauan check-in, dan ekspor data."
    >
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-xs">
          <Input
            type="search"
            placeholder="Cari nama atau kode tiket..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-10 rounded-xl text-xs"
          />
        </div>
        <Button variant="outline" size="sm" rounded="lg" onClick={handleExport}>
          Ekspor CSV
        </Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <th className="py-3 pr-4">Kode</th>
              <th className="py-3 pr-4">Pemegang Tiket</th>
              <th className="py-3 pr-4">Jenis</th>
              <th className="py-3 pr-4">Status Tiket</th>
              <th className="py-3 pr-4">Check-in</th>
              <th className="py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50/70">
                <td className="py-3.5 pr-4 font-mono font-bold text-slate-700">{row.id}</td>
                <td className="py-3.5 pr-4">
                  <div className="font-bold text-slate-900">{row.name}</div>
                  <div className="text-[11px] text-slate-400">{row.email}</div>
                </td>
                <td className="py-3.5 pr-4 text-slate-600">{row.ticketType}</td>
                <td className="py-3.5 pr-4">
                  <Badge variant={TICKET_STATUS_VARIANT[row.ticketStatus] || "secondary"}>
                    {row.ticketStatus}
                  </Badge>
                </td>
                <td className="py-3.5 pr-4">
                  <Badge variant={row.checkedIn ? "success" : "warning"}>
                    {row.checkedIn ? "Sudah masuk" : "Belum check-in"}
                  </Badge>
                </td>
                <td className="py-3.5 text-right">
                  <Button
                    size="sm"
                    variant="outline"
                    rounded="lg"
                    onClick={() => onToggleCheckIn(row.id)}
                  >
                    {row.checkedIn ? "Batalkan" : "Tandai Hadir"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SectionCard>
  );
}

export function LaporanPanel({ event, attendees }) {
  const stats = getEventStats(event);
  const checkedIn = attendees.filter((row) => row.checkedIn).length;
  const methods = attendees.reduce((acc, row) => {
    acc[row.payment] = (acc[row.payment] || 0) + row.total;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { title: "Total Pendapatan", value: formatRupiah(stats.revenue) },
          { title: "Tiket Terjual", value: `${event.sold} tiket` },
          {
            title: "Tingkat Check-in",
            value: attendees.length
              ? `${Math.round((checkedIn / attendees.length) * 100)}%`
              : "0%",
          },
        ].map((item) => (
          <div key={item.title} className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold text-slate-500">{item.title}</p>
            <p className="mt-1 text-xl font-black text-slate-900">{item.value}</p>
          </div>
        ))}
      </div>

      <SectionCard
        title="Laporan Penjualan Harian"
        subtitle={`Rincian penjualan khusus ${event.title}.`}
      >
        <SalesChart data={event.dailySales} />
        <div className="mt-6 overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <th className="py-3 pr-4">Tanggal</th>
                <th className="py-3 pr-4">Tiket</th>
                <th className="py-3">Pendapatan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {event.dailySales.map((day) => (
                <tr key={day.date} className="hover:bg-slate-50/70">
                  <td className="py-3 pr-4 font-semibold text-slate-700">{day.date}</td>
                  <td className="py-3 pr-4 text-slate-600">{day.sold}</td>
                  <td className="py-3 font-bold text-slate-900">{formatRupiah(day.revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <SectionCard title="Pendapatan per Metode Pembayaran" subtitle="Berdasarkan pesanan acara ini.">
        <div className="space-y-3">
          {Object.entries(methods).map(([method, total]) => (
            <div key={method} className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-600">{method}</span>
              <span className="font-bold text-slate-900">{formatRupiah(total)}</span>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

export function PengaturanPanel({ event, onEventChange, onDeleted }) {
  const handlePublish = async () => {
    const confirmed = await notify.confirm({
      title: "Publikasikan Acara?",
      html: `<p>Acara <strong>${event.title}</strong> akan dipublikasikan dan penjualan tiket dibuka.</p>`,
      confirmText: "Ya, Publikasikan",
      cancelText: "Batal",
    });
    if (confirmed) {
      onEventChange({ status: "aktif" });
      notify.success("Acara berhasil dipublikasikan.");
    }
  };

  const handleClose = async () => {
    const confirmed = await notify.confirm({
      title: "Tutup Penjualan?",
      html: "<p>Penjualan tiket akan dihentikan. Pesanan yang sudah masuk tetap diproses.</p>",
      confirmText: "Ya, Tutup",
      cancelText: "Batal",
      danger: true,
    });
    if (confirmed) {
      onEventChange({ status: "ditutup" });
      notify.success("Penjualan tiket ditutup.");
    }
  };

  const handleCancel = async () => {
    const confirmed = await notify.confirm({
      title: "Batalkan Acara?",
      html: "<p>Acara akan dibatalkan dan tidak lagi ditampilkan ke peserta.</p>",
      confirmText: "Ya, Batalkan",
      cancelText: "Batal",
      danger: true,
    });
    if (confirmed) {
      onEventChange({ status: "batal" });
      notify.success("Acara dibatalkan.");
    }
  };

  const handleDelete = async () => {
    const confirmed = await notify.confirm({
      title: "Hapus Draft?",
      html: "<p>Draft acara akan dihapus permanen dari daftar Acara Saya.</p>",
      confirmText: "Ya, Hapus",
      cancelText: "Batal",
      danger: true,
    });
    if (confirmed) {
      onDeleted();
      notify.success("Draft acara dihapus.");
    }
  };

  return (
    <div className="space-y-6">
      <SectionCard title="Status Acara" subtitle="Kelola siklus hidup acara ini.">
        <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
          <div>
            <p className="text-xs font-semibold text-slate-500">Status saat ini</p>
            <p className="mt-1 text-lg font-black text-slate-900">
              {getStatusLabel(event.status)}
            </p>
          </div>
          <Badge variant={getStatusVariant(event.status)}>{getStatusLabel(event.status)}</Badge>
        </div>
      </SectionCard>

      <SectionCard title="Aksi Penyelenggara" subtitle="Perubahan akan langsung tercermin di Acara Saya.">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Button variant="primary" rounded="xl" onClick={handlePublish}>
            Publikasikan
          </Button>
          <Button variant="outline" rounded="xl" onClick={handleClose}>
            Tutup Penjualan
          </Button>
          <Button variant="danger" rounded="xl" onClick={handleCancel}>
            Batalkan Acara
          </Button>
          <Button variant="ghost" rounded="xl" onClick={handleDelete}>
            Hapus Draft
          </Button>
        </div>
      </SectionCard>
    </div>
  );
}
