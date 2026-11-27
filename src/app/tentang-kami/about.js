"use client";

import Image from "next/image";
import {
  Award,
  Building2,
  Check,
  Coins,
  GraduationCap,
  HeartHandshake,
  ShieldCheck,
  Stethoscope,
  Users,
} from "lucide-react";
import Navbar from "@/app/landing/Navbar";
import Footer from "@/app/landing/Footer";
import Button from "@/components/ui/button";
import { BRAND } from "@/constants/brand";

const MILESTONES = [
  {
    year: "1994 - 1995",
    title: "Awal Berdiri di Jawa Timur",
    desc: "Digagas oleh para alumni STAN pada 17 September 1994 di Malang dan resmi beroperasi pada tahun 1995 dengan kantor pusat di Surabaya.",
  },
  {
    year: "2005",
    title: "Pengesahan LAZ Tingkat Provinsi",
    desc: "Memperoleh pengesahan resmi sebagai Lembaga Amil Zakat (LAZ) Jawa Timur melalui SK Gubernur Jawa Timur No. 451/1702/032/2005.",
  },
  {
    year: "2016 - Sekarang",
    title: "Lembaga Amil Zakat Nasional (LAZNAS)",
    desc: "Dikukuhkan oleh Kementerian Agama RI sebagai LAZNAS (SK Menteri Agama RI No. 184 Tahun 2016 dan diperbarui melalui SK No. 672 Tahun 2021).",
  },
];

const LEGALITY_HIGHLIGHTS = [
  {
    icon: Award,
    title: "LAZNAS Resmi Kemenag RI",
    desc: "Berizin nasional berdasarkan SK Menteri Agama RI dengan tata kelola kelembagaan yang terstandarisasi.",
  },
  {
    icon: ShieldCheck,
    title: "Audit Keuangan Predikat WTP",
    desc: "Laporan keuangan diaudit secara berkala oleh Kantor Akuntan Publik dengan predikat Wajar Tanpa Pengecualian.",
  },
  {
    icon: HeartHandshake,
    title: "Aliansi Kemanusiaan (IHA)",
    desc: "Tergabung dalam Indonesia Humanitarian Alliance untuk aksi tanggap darurat dan kemanusiaan nasional maupun global.",
  },
];

const PROGRAM_PILLARS = [
  {
    icon: GraduationCap,
    title: "Pendidikan",
    desc: "Beasiswa pendidikan, pembinaan generasi muda, dan dukungan sarana belajar bagi masyarakat prasejahtera.",
  },
  {
    icon: Coins,
    title: "Ekonomi & Pemberdayaan",
    desc: "Pendampingan UMKM, pelatihan kemandirian usaha, serta penguatan ekonomi produktif berbasis komunitas.",
  },
  {
    icon: Stethoscope,
    title: "Kesehatan",
    desc: "Layanan kesehatan gratis, aksi donor darah, pemeriksaan berkala, dan bantuan medis bagi keluarga dhuafa.",
  },
  {
    icon: Users,
    title: "Dakwah & Kemanusiaan",
    desc: "Syiar kebaikan, pembinaan masyarakat, serta respon cepat tanggap bencana di berbagai wilayah Indonesia.",
  },
];

const MISSIONS = [
  "Mengelola zakat, infak, sedekah, dan dana sosial kemanusiaan secara profesional, transparan, dan akuntabel.",
  "Memberdayakan masyarakat melalui pilar pendidikan, ekonomi, kesehatan, dakwah, dan kemanusiaan yang berkelanjutan.",
  "Menghadirkan ekosistem kegiatan dan event positif melalui LMI Event untuk memperluas kolaborasi kebaikan.",
];

// TODO: Ganti `image` dengan path foto dokumentasi resmi LMI di folder `public/images/`.
// `aspectClass` bisa di-custom per card (misal: "aspect-[4/3]", "aspect-[4/5]", "aspect-square", "aspect-video").
const GALLERY_CARDS = [
  {
    title: "Kegiatan Sosial & Kemanusiaan LMI",
    category: "Kemanusiaan",
    desc: "Penyaluran bantuan langsung dan aksi tanggap darurat bagi masyarakat terdampak di berbagai daerah.",
    image: "/images/example.jpg",
    aspectClass: "aspect-[16/10]",
  },
  {
    title: "Program Pemberdayaan Pendidikan",
    category: "Pendidikan",
    desc: "Pendampingan belajar dan penyaluran beasiswa untuk mencetak generasi yang mandiri dan berdaya saing.",
    image: "/images/example.jpg",
    aspectClass: "aspect-[10/5]",
  },
  {
    title: "Kolaborasi Event & Komunitas",
    category: "LMI Event",
    desc: "Penyelenggaraan seminar, kajian, festival, dan acara komunitas dengan sistem tiket resmi LMI Event.",
    image: "/images/example.jpg",
    aspectClass: "aspect-[16/9]",
  },
  {
    title: "Penguatan Ekonomi Masyarakat",
    category: "Ekonomi",
    desc: "Program pembinaan usaha mikro dan komunitas binaan menuju kemandirian ekonomi berkelanjutan.",
    image: "/images/example.jpg",
    aspectClass: "aspect-square",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F7F8FC] text-slate-800 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1">
        {/* 1. HERO SECTION */}
        <section className="bg-white border-b border-slate-200/80 py-14 sm:py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-5">
            <span className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-brand-700 bg-brand-50 px-3.5 py-1.5 rounded-full border border-brand-200/80">
              <Building2 className="w-3.5 h-3.5" />
              <span>Tentang Lembaga Manajemen Infaq (LMI)</span>
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Mengelola Amanah Umat, Menghadirkan Manfaat Nyata Sejak 1995
            </h1>
            <p className="text-sm sm:text-base text-slate-600 max-w-3xl mx-auto leading-relaxed">
              <strong>LAZNAS Lembaga Manajemen Infaq (LMI)</strong> adalah lembaga filantropi Islam berskala nasional yang berfokus pada penghimpunan dan penyaluran dana Zakat, Infak, Sedekah, Wakaf (ZISWAF), serta dana sosial kemanusiaan secara profesional, transparan, dan akuntabel. Melalui <strong>{BRAND.name}</strong>, LMI memperluas jangkauan kolaborasi acara edukatif, sosial, dan komunitas di Indonesia.
            </p>
          </div>
        </section>

        {/* 2. RINGKASAN LEGALITAS & KREDIBILITAS */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 -mt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {LEGALITY_HIGHLIGHTS.map((item) => {
              const IconComp = item.icon;
              return (
                <div
                  key={item.title}
                  className="rounded-2xl bg-white border border-slate-200/90 p-6 shadow-sm space-y-2.5"
                >
                  <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center border border-brand-100">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <h2 className="text-base font-extrabold text-slate-900">
                    {item.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* 3. JEJAK SEJARAH LMI */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-16">
          <div className="mb-8 space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-brand-600">
              Sejarah Singkat
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Perjalanan Lembaga Manajemen Infaq
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {MILESTONES.map((step) => (
              <div
                key={step.year}
                className="rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-7 shadow-sm space-y-3"
              >
                <span className="inline-block text-xs font-extrabold text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-200/70">
                  {step.year}
                </span>
                <h3 className="text-lg font-extrabold text-slate-900">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 4. VISI & MISI */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="rounded-3xl bg-white border border-slate-200/90 p-7 sm:p-8 shadow-sm space-y-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-brand-600">
                Visi LMI
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900">
                Terpercaya, Profesional, dan Berdampak Positif
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Menjadi lembaga pengelola zakat, infak, dan sedekah yang terpercaya, profesional, dan berdampak positif bagi masyarakat luas melalui tata kelola yang amanah serta program pemberdayaan berkelanjutan.
              </p>
            </div>

            <div className="rounded-3xl bg-white border border-slate-200/90 p-7 sm:p-8 shadow-sm space-y-4">
              <span className="text-xs font-extrabold uppercase tracking-wider text-brand-600">
                Misi LMI
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900">
                Pemberdayaan &amp; Transparansi Berkelanjutan
              </h2>
              <ul className="space-y-3">
                {MISSIONS.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-slate-600">
                    <span className="shrink-0 w-5 h-5 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center mt-0.5">
                      <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* 5. PILAR PROGRAM LMI */}
        <section className="bg-white border-y border-slate-200/80 py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-brand-600">
                Pilar Program
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Fokus Kontribusi Lembaga Manajemen Infaq
              </h2>
              <p className="text-sm text-slate-500">
                Penyaluran manfaat terstruktur untuk mengangkat harkat martabat masyarakat melalui empat pilar utama.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {PROGRAM_PILLARS.map((pillar) => {
                const PillarIcon = pillar.icon;
                return (
                  <div
                    key={pillar.title}
                    className="rounded-3xl bg-[#F7F8FC] border border-slate-200/80 p-6 space-y-3"
                  >
                    <div className="w-11 h-11 rounded-2xl bg-brand-100 text-brand-700 flex items-center justify-center">
                      <PillarIcon className="w-5 h-5" />
                    </div>
                    <h3 className="font-extrabold text-base text-slate-900">
                      {pillar.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 6. GALERI & DOKUMENTASI GAMBAR */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div className="space-y-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-brand-600">
                Galeri Dokumentasi
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Potret Aktivitas &amp; Program LMI
              </h2>
            </div>
            <p className="text-xs text-slate-500 max-w-sm">
              Dokumentasi kegiatan penyaluran program, pemberdayaan komunitas, hingga penyelenggaraan acara bersama {BRAND.name}.
            </p>
          </div>

          <div className="columns-1 sm:columns-2 gap-6 space-y-6">
            {GALLERY_CARDS.map((card) => (
              <article
                key={card.title}
                className="break-inside-avoid group overflow-hidden rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-lg hover:border-brand-300 transition-all"
              >
                <div className={`relative w-full overflow-hidden bg-slate-100 ${card.aspectClass || "aspect-[16/10]"}`}>
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute top-3 left-3 rounded-full bg-slate-900/75 backdrop-blur-sm px-3 py-1 text-[11px] font-bold text-white">
                    {card.category}
                  </span>
                </div>
                <div className="p-6 space-y-2">
                  <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-brand-700 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {card.desc}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* 7. CTA BANNER */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
          <div className="rounded-3xl bg-gradient-to-r from-brand-600 to-brand-700 text-white p-8 sm:p-10 text-center space-y-4 shadow-xl shadow-brand-600/20">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Siap Berkolaborasi Bersama {BRAND.name}?
            </h2>
            <p className="text-sm text-white/90 max-w-lg mx-auto leading-relaxed">
              Punya pertanyaan seputar kemitraan atau ingin berkonsultasi mengenai penyelenggaraan event Anda? Tim kami siap membantu.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Button href="/hubungi-kami" variant="white" size="lg" rounded="full">
                Hubungi Kami
              </Button>
              <Button
                href="/#event"
                variant="outline"
                size="lg"
                rounded="full"
                className="bg-white/10 text-white border-white/30 hover:bg-white/20"
              >
                Jelajahi Event
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
