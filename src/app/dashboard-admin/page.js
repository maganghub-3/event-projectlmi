"use client";

import { useState } from "react";
import Icon from "@/app/landing/Icon";
import Button from "@/components/ui/button";
import notify from "@/lib/sweetalert";

// Data dummy metrik super admin
const METRICS = [
  {
    id: 1,
    title: "Total Transaksi Penjualan",
    value: "Rp 248.500.000",
    change: "+14.8%",
    isPositive: true,
    subtext: "vs bulan sebelumnya",
    icon: "creditCard",
    iconBg: "bg-emerald-100 text-emerald-700",
  },
  {
    id: 2,
    title: "Total Tiket Terjual",
    value: "14.280 Tiket",
    change: "+8.2%",
    isPositive: true,
    subtext: "dari 48 event aktif",
    icon: "ticket",
    iconBg: "bg-brand-100 text-brand-700",
  },
  {
    id: 3,
    title: "Event Terpublikasi",
    value: "48 Event",
    change: "6 Event Baru",
    isPositive: true,
    subtext: "minggu ini",
    icon: "dashboard",
    iconBg: "bg-purple-100 text-purple-700",
  },
  {
    id: 4,
    title: "Penyelenggara (EO)",
    value: "124 EO Mitra",
    change: "3 Menunggu",
    isPositive: false,
    subtext: "butuh verifikasi",
    icon: "building",
    iconBg: "bg-amber-100 text-amber-700",
  },
];

// Data permohonan EO yang butuh verifikasi admin
const INITIAL_PENDING_EOS = [
  {
    id: "eo-1",
    name: "Kolektif Nada Nusantara",
    contact: "Budi Santoso • 0812-9876-5432",
    email: "kontak@nadanusantara.id",
    category: "Festival Musik",
    date: "23 Nov 2026, 14:20",
    city: "Jakarta Selatan",
    documents: "KTP & NPWP Terverifikasi",
  },
  {
    id: "eo-2",
    name: "Bandung Creative Class",
    contact: "Aulia Rahma • 0857-1122-3344",
    email: "hello@creativebandung.org",
    category: "Workshop & Seni",
    date: "23 Nov 2026, 11:05",
    city: "Bandung",
    documents: "SIUP & Akta Perusahaan",
  },
  {
    id: "eo-3",
    name: "Java Sound & Lights",
    contact: "Rian Hidayat • 0813-8899-0011",
    email: "info@javasound.co.id",
    category: "Konser Outdoor",
    date: "22 Nov 2026, 19:45",
    city: "Surabaya",
    documents: "KTP Penanggung Jawab",
  },
];

// Data transaksi tiket terkini
const RECENT_TRANSACTIONS = [
  {
    id: "TRX-94812",
    buyer: "Ananda Putri",
    email: "ananda.putri@gmail.com",
    event: "Jakarta Indie Music Vibes 2026",
    ticketsCount: 2,
    amount: "Rp 370.000",
    paymentMethod: "QRIS GoPay",
    status: "success",
    time: "5 menit lalu",
  },
  {
    id: "TRX-94811",
    buyer: "Dimas Suryo",
    email: "dimas.suryo@yahoo.com",
    event: "Hands-on Ceramic & Pottery Class",
    ticketsCount: 1,
    amount: "Rp 250.000",
    paymentMethod: "BCA Virtual Account",
    status: "success",
    time: "18 menit lalu",
  },
  {
    id: "TRX-94810",
    buyer: "Clara Angelina",
    email: "clara.ang@gmail.com",
    event: "Bandung Street Food & Chill Carnival",
    ticketsCount: 4,
    amount: "Rp 180.000",
    paymentMethod: "ShopeePay",
    status: "pending",
    time: "32 menit lalu",
  },
  {
    id: "TRX-94809",
    buyer: "Reza Firmansyah",
    email: "reza.firman@gmail.com",
    event: "Morning Sunset Yoga & Sound Bathing",
    ticketsCount: 1,
    amount: "Rp 150.000",
    paymentMethod: "Mandiri VA",
    status: "success",
    time: "1 jam lalu",
  },
  {
    id: "TRX-94808",
    buyer: "Fajar Nugraha",
    email: "fajar.nug@gmail.com",
    event: "Jogja Art & Independent Film Weekend",
    ticketsCount: 2,
    amount: "Rp 120.000",
    paymentMethod: "QRIS Dana",
    status: "cancelled",
    time: "2 jam lalu",
  },
];

// Event terpopuler & performa kuota
const TOP_EVENTS = [
  {
    id: 1,
    name: "Jakarta Indie Music Vibes 2026",
    sold: 1786,
    total: 1800,
    revenue: "Rp 330.410.000",
    percentage: 99,
  },
  {
    id: 2,
    name: "Bandung Street Food & Chill Carnival",
    sold: 3120,
    total: 3200,
    revenue: "Rp 140.400.000",
    percentage: 97,
  },
  {
    id: 3,
    name: "Jogja Art & Independent Film Weekend",
    sold: 625,
    total: 650,
    revenue: "Rp 37.500.000",
    percentage: 96,
  },
  {
    id: 4,
    name: "Surabaya Young Creators & Tech Talk",
    sold: 360,
    total: 400,
    revenue: "Rp 34.200.000",
    percentage: 90,
  },
];

export default function SuperAdminDashboardPage() {
  const [period, setPeriod] = useState("30d");
  const [pendingEos, setPendingEos] = useState(INITIAL_PENDING_EOS);
  const [searchTx, setSearchTx] = useState("");

  // Aksi verifikasi terima EO
  const handleApproveEo = async (eo) => {
    const confirmed = await notify.confirm({
      title: "Setujui Penyelenggara?",
      text: `Apakah Anda yakin ingin memverifikasi "${eo.name}"? EO ini akan langsung dapat menerbitkan event dan tiket resmi.`,
      confirmText: "Ya, Setujui EO",
      cancelText: "Periksa Lagi",
    });

    if (confirmed) {
      setPendingEos((prev) => prev.filter((item) => item.id !== eo.id));
      notify.alert({
        title: "Penyelenggara Diverifikasi!",
        html: `<p>Akun <strong>${eo.name}</strong> telah aktif dan menerima hak penerbitan tiket.</p>`,
        icon: "success",
      });
    }
  };

  // Aksi tolak verifikasi EO
  const handleRejectEo = async (eo) => {
    const confirmed = await notify.confirm({
      title: "Tolak Pengajuan EO?",
      text: `Permohonan dari "${eo.name}" akan ditolak dan pemberitahuan perbaikan berkas akan dikirim ke emailnya.`,
      confirmText: "Tolak Pengajuan",
      cancelText: "Batal",
      danger: true,
    });

    if (confirmed) {
      setPendingEos((prev) => prev.filter((item) => item.id !== eo.id));
      notify.toast(`Pengajuan ${eo.name} telah ditolak.`);
    }
  };

  // Filter transaksi
  const filteredTransactions = RECENT_TRANSACTIONS.filter((tx) => {
    const q = searchTx.toLowerCase();
    return (
      tx.id.toLowerCase().includes(q) ||
      tx.buyer.toLowerCase().includes(q) ||
      tx.event.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-8">
      {/* 1. WELCOME BANNER & DATE FILTER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-brand-700 bg-brand-50 px-2.5 py-1 rounded-full border border-brand-200">
            Pusat Kendali LMI Event
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 tracking-tight">
            Ringkasan Operasional
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Pantau arus transaksi, verifikasi mitra event organizer, dan pantau penjualan tiket real-time.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={period}
            onChange={(e) => {
              setPeriod(e.target.value);
              notify.toast(`Periode waktu diubah ke: ${e.target.options[e.target.selectedIndex].text}`);
            }}
            className="px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 outline-none cursor-pointer focus:bg-white focus:border-brand-500 transition"
          >
            <option value="today">Hari Ini</option>
            <option value="7d">7 Hari Terakhir</option>
            <option value="30d">30 Hari Terakhir</option>
            <option value="year">Tahun Ini (2026)</option>
          </select>

          <Button
            variant="outline"
            size="sm"
            rounded="xl"
            onClick={() => notify.toast("Mengunduh laporan CSV rekapitulasi data...")}
          >
            Export CSV
          </Button>
        </div>
      </div>

      {/* 2. STAT METRICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {METRICS.map((metric) => (
          <div
            key={metric.id}
            className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {metric.title}
                </p>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 tracking-tight">
                  {metric.value}
                </h3>
              </div>
              <div className={`p-3 rounded-2xl ${metric.iconBg} shrink-0 shadow-sm`}>
                <Icon name={metric.icon} className="w-5 h-5" />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span
                className={`font-bold inline-flex items-center gap-1 ${
                  metric.isPositive ? "text-emerald-600" : "text-amber-600"
                }`}
              >
                {metric.isPositive ? "↑" : "•"} {metric.change}
              </span>
              <span className="text-slate-400">{metric.subtext}</span>
            </div>
          </div>
        ))}
      </div>

      {/* 3. TWO-COLUMN OPERATIONAL SECTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Antrean Verifikasi EO & Tabel Transaksi */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* A. ANTREAN VERIFIKASI EO (PENDING APPROVAL) */}
          <section id="verifikasi-eo" className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm scroll-mt-24">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-base">
                  <Icon name="ticket" className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
                    Antrean Verifikasi Organizer (EO)
                  </h3>
                  <p className="text-xs text-slate-500">
                    {pendingEos.length} permohonan baru menunggu peninjauan Super Admin
                  </p>
                </div>
              </div>

              {pendingEos.length > 0 && (
                <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-[11px] font-extrabold">
                  {pendingEos.length} Butuh Tindakan
                </span>
              )}
            </div>

            {pendingEos.length === 0 ? (
              <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <Icon name="sparkles" className="mx-auto mb-2 h-8 w-8" />
                <p className="text-sm font-bold text-slate-700">Semua Permohonan Telah Ditinjau!</p>
                <p className="text-xs text-slate-400 mt-1">Tidak ada mitra EO yang sedang menunggu verifikasi.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingEos.map((eo) => (
                  <div
                    key={eo.id}
                    className="p-4 sm:p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:bg-white hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-sm text-slate-900">{eo.name}</h4>
                        <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                          {eo.city}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600">{eo.contact} • {eo.email}</p>
                      <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-500">
                        <span>Kategori: <strong>{eo.category}</strong></span>
                        <span>•</span>
                        <span>{eo.documents}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleRejectEo(eo)}
                        className="px-3.5 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200/80 transition"
                      >
                        Tolak
                      </button>
                      <button
                        type="button"
                        onClick={() => handleApproveEo(eo)}
                        className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white shadow-sm transition"
                      >
                        ✓ Setujui Mitra
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* B. TABEL TRANSAKSI TIKET TERBARU */}
          <section id="transaksi" className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm scroll-mt-24">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
                  Transaksi Tiket Terbaru
                </h3>
                <p className="text-xs text-slate-500">
                  Aktivitas pembelian tiket pengunjung di seluruh event
                </p>
              </div>

              {/* Mini search for transactions */}
              <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 focus-within:bg-white focus-within:border-brand-500 transition w-full sm:w-64">
                <Icon name="search" className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={searchTx}
                  onChange={(e) => setSearchTx(e.target.value)}
                  placeholder="Cari transaksi / pembeli..."
                  className="bg-transparent text-xs outline-none w-full text-slate-800 placeholder-slate-400 font-medium"
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto -mx-6 px-6">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider text-[10px]">
                    <th className="pb-3 font-bold">ID Transaksi</th>
                    <th className="pb-3 font-bold">Pembeli</th>
                    <th className="pb-3 font-bold">Acara Event</th>
                    <th className="pb-3 font-bold">Metode Bayar</th>
                    <th className="pb-3 font-bold">Nominal</th>
                    <th className="pb-3 font-bold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 font-mono font-bold text-brand-600">
                        {tx.id}
                      </td>
                      <td className="py-3.5">
                        <p className="font-bold text-slate-900">{tx.buyer}</p>
                        <p className="text-[11px] text-slate-400">{tx.email}</p>
                      </td>
                      <td className="py-3.5 max-w-[200px] truncate text-slate-700">
                        {tx.event}
                        <span className="block text-[10px] text-slate-400">({tx.ticketsCount} tiket)</span>
                      </td>
                      <td className="py-3.5 text-slate-600">
                        {tx.paymentMethod}
                      </td>
                      <td className="py-3.5 font-bold text-slate-900">
                        {tx.amount}
                      </td>
                      <td className="py-3.5">
                        {tx.status === "success" && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            ✓ Berhasil
                          </span>
                        )}
                        {tx.status === "pending" && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                            Menunggu
                          </span>
                        )}
                        {tx.status === "cancelled" && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                            ✕ Batal
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

        </div>

        {/* RIGHT COLUMN: Event Populer & Audit Activity */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* EVENT TERLARIS SAAT INI */}
          <section id="events" className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm scroll-mt-24">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                Event Terlaris Saat Ini
              </h3>
              <span className="text-[11px] font-bold text-brand-600 cursor-pointer hover:underline">
                Lihat Semua
              </span>
            </div>

            <div className="space-y-4">
              {TOP_EVENTS.map((event) => (
                <div key={event.id} className="space-y-1.5 pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between text-xs">
                    <h4 className="font-bold text-slate-900 truncate max-w-[200px]" title={event.name}>
                      {event.name}
                    </h4>
                    <span className="font-extrabold text-slate-900">{event.percentage}%</span>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-brand-600 rounded-full transition-all duration-500"
                      style={{ width: `${event.percentage}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>{event.sold} / {event.total} tiket</span>
                    <span className="font-semibold text-slate-600">{event.revenue}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* AKTIVITAS SISTEM & AUDIT LOG */}
          <section className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight mb-4">
              Aktivitas Sistem Terbaru
            </h3>

            <div className="space-y-3.5 text-xs text-slate-600">
              <div className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-brand-500 mt-1.5 shrink-0" />
                <div>
                  <p className="font-bold text-slate-800">Tiket VIP Konser Indie ditambahkan</p>
                  <p className="text-[11px] text-slate-400">SoundWave Project menambah 50 kuota • 10 mnt lalu</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <div>
                  <p className="font-bold text-slate-800">Pencairan Dana EO Berhasil</p>
                  <p className="text-[11px] text-slate-400">Pencairan Rp 45.000.000 ke Kiara Park • 1 jam lalu</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                <div>
                  <p className="font-bold text-slate-800">Registrasi EO Baru</p>
                  <p className="text-[11px] text-slate-400">Kolektif Nada mengirimkan berkas KTP • 2 jam lalu</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-purple-500 mt-1.5 shrink-0" />
                <div>
                  <p className="font-bold text-slate-800">Backup Database Selesai</p>
                  <p className="text-[11px] text-slate-400">Sistem otomatis mencadangkan data tiket • Subuh tadi</p>
                </div>
              </div>
            </div>
          </section>

        </div>

      </div>
    </div>
  );
}
