import Link from "next/link";
import Icon from "@/app/landing/Icon";

const QUICK_LINKS = [
  {
    title: "Kelola Berita",
    description: "Tulis cerita event Anda dan kirim untuk ditinjau oleh super admin.",
    href: "/organizer/berita",
    icon: "news",
    tone: "bg-brand-50 text-brand-700",
  },
  {
    title: "Event Saya",
    description: "Pantau event, kuota tiket, dan penjualan penyelenggara.",
    href: "/organizer#events",
    icon: "ticket",
    tone: "bg-emerald-50 text-emerald-700",
  },
  {
    title: "Panduan EO",
    description: "Pelajari alur penerbitan tiket hingga pencairan dana.",
    href: "/organizer#panduan",
    icon: "shield",
    tone: "bg-amber-50 text-amber-700",
  },
];

export default function OrganizerOverviewPage() {
  return (
    <div className="space-y-6">
      <div>
        <span className="inline-flex rounded-full bg-brand-50 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-brand-700 ring-1 ring-brand-200">
          Ringkasan EO
        </span>
        <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
          Selamat datang, Penyelenggara
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Semua yang Anda butuhkan untuk mengelola event dan cerita kemitraan ada di sini.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {QUICK_LINKS.map((link) => (
          <Link
            key={link.title}
            href={link.href}
            className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-brand-300 hover:shadow-lg"
          >
            <div className={`inline-flex rounded-xl p-2.5 ${link.tone}`}>
              <Icon name={link.icon} className="h-5 w-5" />
            </div>
            <h3 className="mt-3 text-sm font-extrabold text-slate-900 group-hover:text-brand-700">
              {link.title}
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">{link.description}</p>
            <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-brand-600">
              Buka <Icon name="arrowRight" className="h-3.5 w-3.5" />
            </span>
          </Link>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-sm font-extrabold text-slate-900">Status Akun</h3>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-600">
          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 font-bold text-emerald-700">
            ✓ Terverifikasi
          </span>
          <span>Akun EO Anda aktif dan dapat menerbitkan event serta mengirim berita.</span>
        </div>
      </div>
    </div>
  );
}
