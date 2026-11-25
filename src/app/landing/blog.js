"use client";

import { useState } from "react";
import Image from "next/image";
import Button from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import notify from "@/lib/sweetalert";
import { BRAND } from "@/constants/brand";
import { COLLABORATION_STORIES } from "@/data/blog-stories";

export { COLLABORATION_STORIES };

export default function BlogSection() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredStories =
    selectedCategory === "all"
      ? COLLABORATION_STORIES
      : COLLABORATION_STORIES.filter((s) => s.category === selectedCategory);

  return (
    <>
      {/* 1. BLOG & KILAS EVENT KERJASAMA */}
      <section id="blog" className="py-16 md:py-24 bg-white scroll-mt-20 border-b border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          
          {/* Section Header */}
          <div data-reveal="bottom" className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-extrabold uppercase tracking-wider text-brand-700 bg-brand-50 px-3.5 py-1.5 rounded-full border border-brand-200/80">
              Berita &amp; Kilas Event Kerjasama
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-3 tracking-tight">
              Event yang Pernah Tumbuh Bersama {BRAND.name}
            </h2>
            <p className="text-sm sm:text-base text-slate-500 mt-3 leading-relaxed">
              Liputan dokumentasi dan cerita di balik layar bagaimana kami membantu penyelenggara event di Indonesia mengelola tiket resmi, sistem antrean cepat, dan pencairan dana tepat waktu.
            </p>

            {/* Filter Kategori Tab */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
              {[
                { id: "all", label: "Semua Liputan" },
                { id: "musik", label: "Konser Musik" },
                { id: "festival", label: "Festival Kuliner" },
                { id: "olahraga", label: "Olahraga & Komunitas" },
                { id: "workshop", label: "Workshop & Summit" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                    selectedCategory === tab.id
                      ? "bg-brand-600 text-white shadow-md shadow-brand-600/25"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Grid Artikel / Kartu Liputan Kerjasama */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStories.map((story) => (
              <article
                key={story.id}
                data-reveal="bottom"
                className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-xl hover:border-brand-300 hover:-translate-y-1.5 transition-all duration-300 overflow-hidden"
              >
                <div>
                  {/* Visual Header Banner */}
                  <div className={`relative h-36 bg-gradient-to-tr ${story.gradient} p-5 flex flex-col justify-between text-white overflow-hidden`}>
                    {story.photo && (
                      <>
                        <Image
                          src={story.photo}
                          alt=""
                          fill
                          sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/45 to-slate-950/20 pointer-events-none" />
                      </>
                    )}
                    <div className="z-10">
                      <Badge variant="secondary" className="bg-white/20 backdrop-blur-md text-white border-white/20 font-bold">
                        {story.categoryLabel}
                      </Badge>
                    </div>

                    <div className="z-10 flex items-center justify-between">
                      <span className="text-xs font-mono font-bold bg-white/20 px-3 py-1 rounded-full text-white/95">
                        {story.metrics.tickets}
                      </span>
                    </div>

                    {/* Subtle backdrop circle decoration */}
                    <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-white/10 rounded-full blur-xl pointer-events-none" />
                  </div>

                  {/* Card Content */}
                  <div className="p-5 sm:p-6 space-y-3.5">
                    <div className="text-xs font-bold uppercase tracking-wider text-brand-600">
                      Mitra: {story.partner}
                    </div>

                    <h3 className="text-base sm:text-lg font-extrabold text-slate-900 leading-snug group-hover:text-brand-600 transition-colors">
                      {story.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {story.summary}
                    </p>

                    {/* Metric Highlights Pill */}
                    <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-semibold text-slate-500">
                      <span className="bg-slate-100 px-2.5 py-1 rounded-lg">
                        {story.metrics.scanSpeed}
                      </span>
                      <span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg border border-emerald-200">
                        ✓ {story.metrics.soldOutTime}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="px-5 pb-5 pt-2 sm:px-6 sm:pb-6 flex flex-wrap items-center justify-between gap-x-4 gap-y-2.5 border-t border-slate-100 mt-2">
                  <div className="text-xs text-slate-500">
                    <span className="font-semibold text-slate-700">{story.partnerRep}</span>
                  </div>
                  <Button
                    href={`/blog/${story.slug}`}
                    variant="outline"
                    size="sm"
                    className="text-xs font-bold text-brand-600 hover:text-brand-700 border-brand-200 hover:bg-brand-50"
                  >
                    Baca Cerita Lengkap →
                  </Button>
                </div>
              </article>
            ))}
          </div>

        </div>
      </section>

      {/* 2. FRIENDLY ORGANIZER CTA BANNER */}
      
    </>
  );
}
