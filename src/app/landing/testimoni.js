"use client";

import Icon from "./Icon";
import notify from "@/lib/sweetalert";

const STARS = Array.from({ length: 5 }, (_, index) => (
  <Icon key={index} name="star" className="h-3.5 w-3.5" />
));
import { BRAND } from "@/constants/brand";

export default function TestimoniSection() {
  return (
    <>
      {/* 1. TESTIMONIALS SECTION (WARM SOCIAL PROOF) */}
      <section id="testimoni" className="py-16 md:py-20 bg-[#F7F8FC] scroll-mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          
          <div data-reveal="left" className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-extrabold uppercase tracking-wider text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
              Cerita Dari Komunitas
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-2">
              Apa Kata Teman yang Sudah Ikutan?
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Dari yang nonton festival sendirian sampai ketemu sahabat baru di workshop kreatif!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div data-reveal="left" className="group bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between hover:shadow-xl hover:-translate-y-2 hover:border-brand-200 transition-all duration-300">
              <div>
                <div className="flex gap-0.5 text-amber-400 text-sm mb-3 group-hover:scale-105 transition-transform origin-left">{STARS}</div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                  &ldquo;Nonton konser musik indie bareng geng kampus jadi gak ribet. E-ticketnya rapi di WhatsApp, pas di gate masuk di-scan cuma 2 detik langsung lolos!&rdquo;
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-700 font-extrabold flex items-center justify-center text-sm group-hover:scale-110 transition-transform">
                  NS
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-brand-700 transition-colors">Nadia Safira</h4>
                  <p className="text-[11px] text-slate-400">Penonton Konser • Jakarta</p>
                </div>
              </div>
            </div>

            <div data-reveal="bottom" className="group bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between hover:shadow-xl hover:-translate-y-2 hover:border-brand-200 transition-all duration-300">
              <div>
                <div className="flex gap-0.5 text-amber-400 text-sm mb-3 group-hover:scale-105 transition-transform origin-left">{STARS}</div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                  &ldquo;Awalnya bingung weekend mau ngapain daripada bengong di kosan. Nemu kelas pottery di {BRAND.name}, ternyata instrukturnya sabar dan dapet banyak teman baru!&rdquo;
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 font-extrabold flex items-center justify-center text-sm group-hover:scale-110 transition-transform">
                  DA
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-brand-700 transition-colors">Dimas Anggara</h4>
                  <p className="text-[11px] text-slate-400">Peserta Workshop • Bandung</p>
                </div>
              </div>
            </div>

            <div data-reveal="right" className="group bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between hover:shadow-xl hover:-translate-y-2 hover:border-brand-200 transition-all duration-300">
              <div>
                <div className="flex gap-0.5 text-amber-400 text-sm mb-3 group-hover:scale-105 transition-transform origin-left">{STARS}</div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                  &ldquo;Sempat salah masukin email waktu beli tiket, panik banget. Tapi pas chat CS via WhatsApp langsung dibantu dalam 5 menit ramah banget. Top markotop!&rdquo;
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 font-extrabold flex items-center justify-center text-sm group-hover:scale-110 transition-transform">
                  RP
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-brand-700 transition-colors">Rian &amp; Priska</h4>
                  <p className="text-[11px] text-slate-400">Pecinta Festival • Surabaya</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 2. FRIENDLY ORGANIZER CTA BANNER */}
      <section id="organizer" className="py-12 bg-white">
        <div data-reveal="bottom" className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="relative rounded-[36px] bg-gradient-to-r from-brand-600 via-brand-500 to-brand-700 text-white p-8 sm:p-12 md:p-14 overflow-hidden shadow-2xl shadow-brand-600/20">
            {/* Background sparkle accents */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-8 space-y-4">
                <span className="inline-block px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider text-white">
                  Untuk Komunitas &amp; Penyelenggara
                </span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
                  Punya ide event seru? Yuk buat bareng {BRAND.name}!
                </h2>
                <p className="text-white/90 text-sm sm:text-base max-w-xl leading-relaxed">
                  Dari gathering komunitas kecil 20 orang hingga festival musik ribuan penonton. Bikin halaman tiketmu gratis hanya dalam 3 menit, tanpa ribet koding!
                </p>
                
                <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-bold text-white/90">
                  <span className="flex items-center gap-1.5">✓ Tanpa Biaya Pendaftaran</span>
                  <span className="flex items-center gap-1.5">✓ Dashboard Analitik Realtime</span>
                  <span className="flex items-center gap-1.5">✓ Pencairan Dana Otomatis</span>
                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
                <button
                  type="button"
                  onClick={() => {
                    notify.toast("Formulir pendaftaran event organizer akan segera dibuka!");
                  }}
                  className="px-6 py-4 bg-white text-brand-700 hover:bg-brand-50 font-extrabold text-sm rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all text-center"
                >
                  Mulai Buat Event Sekarang
                </button>
                <button
                  type="button"
                  onClick={() => {
                    notify.toast("Tim kami siap ngobrol via WhatsApp di 0812-3456-7890!");
                  }}
                  className="px-6 py-4 bg-black/20 hover:bg-black/30 backdrop-blur-md text-white font-bold text-sm rounded-2xl border border-white/30 transition-all text-center"
                >
                  Konsultasi Gratis via WhatsApp
                </button>
              </div>

            </div>
          </div>
        </div>
      </section>
    </>
  );
}
