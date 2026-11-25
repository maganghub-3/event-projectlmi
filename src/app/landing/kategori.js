"use client";

import Icon from "./Icon";
import { CATEGORIES } from "./data";

const CATEGORY_ICONS = {
  all: "sparkles",
  musik: "music",
  festival: "ticket",
  workshop: "sparkles",
  seni: "star",
  olahraga: "trendingUp",
};
export { CATEGORIES };

export default function KategoriSection({ activeCategory = "all", onSelectCategory }) {
  return (
    <section id="kategori" className="py-12 bg-white border-y border-slate-200/80 scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        <div data-reveal="left" className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-200/60">
              Pilih Vibe Kamu
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
              Temukan Acara Berdasarkan Minat
            </h2>
          </div>
          <p className="text-sm text-slate-500 max-w-sm">
            Klik kategori favoritmu untuk menyaring event yang paling sesuai dengan selera hangout-mu!
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {CATEGORIES.map((cat, idx) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                data-reveal="bottom"
                style={{ transitionDelay: `${idx * 60}ms` }}
                onClick={() => {
                  if (onSelectCategory) onSelectCategory(cat.id, cat.name);
                }}
                className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all duration-300 group cursor-pointer ${
                  isActive
                    ? "bg-brand-600 text-white border-brand-600 shadow-lg shadow-brand-600/30 scale-[1.03]"
                    : "bg-[#F7F8FC] hover:bg-white text-slate-800 border-slate-200/80 hover:border-brand-300 hover:shadow-xl hover:-translate-y-1.5 active:scale-95"
                }`}
              >
                <div className="mb-3 group-hover:scale-125 group-hover:-rotate-6 transition-transform duration-300">
                  <Icon name={CATEGORY_ICONS[cat.id] || "sparkles"} className="h-8 w-8" />
                </div>
                <div>
                  <h3 className={`font-bold text-sm transition-colors ${isActive ? "text-white" : "text-slate-900 group-hover:text-brand-700"}`}>
                    {cat.name}
                  </h3>
                  <p className={`text-[11px] mt-0.5 font-medium ${isActive ? "text-brand-100" : "text-slate-400"}`}>
                    {cat.count}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
}
