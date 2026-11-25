"use client";

/* eslint-disable @next/next/no-img-element */
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Icon from "./Icon";
import notify from "@/lib/sweetalert";
import { INITIAL_EVENTS } from "./data";
import { BRAND } from "@/constants/brand";
export { INITIAL_EVENTS };

export default function EventSection({
  activeCategory = "all",
  searchQuery = "",
  selectedCity = "Semua Kota",
  onResetFilters,
}) {
  const [favorites, setFavorites] = useState({});
  const [selectedBookingEvent, setSelectedBookingEvent] = useState(null);

  // Toggle favorite
  const toggleFavorite = (eventId, eventTitle) => {
    setFavorites((prev) => {
      const isFav = !!prev[eventId];
      const nextState = { ...prev, [eventId]: !isFav };
      if (!isFav) {
        notify.toast(`"${eventTitle}" disimpan ke favoritmu!`);
      } else {
        notify.toast("Dihapus dari favorit.");
      }
      return nextState;
    });
  };

  // Filter events realtime
  const filteredEvents = useMemo(() => {
    return INITIAL_EVENTS.filter((evt) => {
      const matchSearch =
        evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        evt.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
        evt.city.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCity =
        selectedCity === "Semua Kota" || evt.city.toLowerCase() === selectedCity.toLowerCase();

      const matchCategory =
        activeCategory === "all" || evt.categoryKey === activeCategory;

      return matchSearch && matchCity && matchCategory;
    });
  }, [searchQuery, selectedCity, activeCategory]);

  // Observer untuk animasi kartu event muncul dari samping saat di-scroll
  useEffect(() => {
    const elements = document.querySelectorAll("#event [data-reveal]");
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -30px 0px" }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [filteredEvents]);

  return (
    <section id="event" className="py-16 md:py-20 scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div data-reveal="left" className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
              <Icon name="sparkles" className="w-3.5 h-3.5 text-brand-500" />
              <span>Paling Ditunggu Minggu Ini</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
              Event Pilihan Teman {BRAND.name}
            </h2>
          </div>

          {/* Quick Filter Status Indicator */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3.5 py-1.5 rounded-full border border-slate-200">
              Ditemukan <strong>{filteredEvents.length}</strong> event
            </span>
            {(activeCategory !== "all" || selectedCity !== "Semua Kota" || searchQuery) && (
              <button
                type="button"
                onClick={onResetFilters}
                className="text-xs text-brand-700 hover:text-brand-700 font-bold underline"
              >
                Reset Semua Filter
              </button>
            )}
          </div>
        </div>

        {/* Event Cards Grid */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300 p-8">
            <Icon name="search" className="h-12 w-12 text-slate-400" />
            <h3 className="text-lg font-bold text-slate-800 mt-3">Ups! Event tidak ditemukan</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto mt-1">
              Coba cari dengan kata kunci lain, atau ubah filter kategori dan kota yang kamu pilih.
            </p>
            <button
              type="button"
              onClick={onResetFilters}
              className="mt-4 px-5 py-2.5 bg-brand-600 text-white font-bold rounded-full text-xs shadow-md hover:bg-brand-700 transition"
            >
              Tampilkan Semua Event
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event, idx) => {
              const isFav = !!favorites[event.id];

              return (
                <article
                  key={event.id}
                  data-reveal={idx % 2 === 0 ? "left" : "right"}
                  style={{ transitionDelay: `${(idx % 4) * 90}ms` }}
                  className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col group"
                >
                  {/* Event Image & Badges */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                    <Link
                      href={`/event/${event.slug}`}
                      aria-label={`Lihat detail ${event.title}`}
                      className="block h-full w-full"
                    >
                      <img
                        src={event.image}
                        alt={event.alt}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </Link>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent pointer-events-none" />
                    
                    {/* Category Tag */}
                    <span className={`absolute top-3.5 left-3.5 px-3 py-1 rounded-full text-[11px] font-bold border shadow-sm ${event.categoryColor}`}>
                      {event.category}
                    </span>

                    {/* Wishlist / Love Button */}
                    <button
                      type="button"
                      onClick={() => toggleFavorite(event.id, event.title)}
                      aria-label={`Simpan event ${event.title}`}
                      className={`absolute top-3.5 right-3.5 w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                        isFav
                          ? "bg-rose-500 text-white shadow-md scale-110"
                          : "bg-white/90 backdrop-blur-sm text-slate-600 hover:text-rose-500 hover:scale-105"
                      }`}
                    >
                      <Icon name={isFav ? "heartFilled" : "heart"} className="w-4 h-4" />
                    </button>

                    {/* Spots Left Pill */}
                    <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-[11px] font-medium flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
                      <span>Sisa {event.spotsLeft} tiket</span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Date & Title row */}
                      <div className="flex items-start gap-3 mb-3">
                        {/* Cute calendar block */}
                        <div className="w-12 h-14 rounded-2xl bg-brand-50 border border-brand-200/80 flex flex-col items-center justify-center text-brand-700 shrink-0">
                          <span className="text-[10px] font-extrabold uppercase tracking-tight">{event.month}</span>
                          <span className="text-xl font-black leading-none">{event.day}</span>
                        </div>

                        <div>
                          <span className="text-[11px] font-bold text-brand-700">
                            {event.badge}
                          </span>
                          <h3 className="text-base font-extrabold text-slate-900 leading-snug transition-colors">
                            <Link href={`/event/${event.slug}`} className="hover:text-brand-700">
                              {event.title}
                            </Link>
                          </h3>
                        </div>
                      </div>

                      {/* Venue & Time details */}
                      <div className="space-y-1.5 text-xs text-slate-500 pt-1 pb-4">
                        <p className="flex items-center gap-2">
                          <Icon name="mapPin" className="w-4 h-4 text-slate-400 shrink-0" />
                          <span className="truncate">{event.venue}, {event.city}</span>
                        </p>
                        <p className="flex items-center gap-2">
                          <Icon name="clock" className="w-4 h-4 text-slate-400 shrink-0" />
                          <span>{event.time}</span>
                        </p>
                      </div>
                    </div>

                    {/* Card Footer: Price & Booking Action */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                      <div>
                        <span className="block text-[10px] text-slate-400 font-semibold uppercase">Mulai dari</span>
                        <span className="text-base font-black text-slate-900">
                          Rp {event.priceLabel}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedBookingEvent(event);
                        }}
                        className="px-4 py-2 bg-brand-600 hover:bg-brand-700 active:scale-95 text-white text-xs font-bold rounded-full shadow-md shadow-brand-600/20 hover:shadow-brand-600/30 flex items-center gap-1.5 transition-all"
                      >
                        <span>Pesan Tiket</span>
                        <Icon name="arrowRight" className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>
                </article>
              );
            })}
          </div>
        )}

      </div>

      {/* MODAL BOOKING INTERAKTIF */}
      {selectedBookingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative">
            
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedBookingEvent(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
            >
              <Icon name="close" className="w-5 h-5" />
            </button>

            {/* Modal Content */}
            <div className="flex items-center gap-2 text-xs font-bold text-brand-700 mb-2">
              <span>Ringkasan Pesanan Cepat</span>
            </div>
            
            <h3 className="text-xl font-extrabold text-slate-900 leading-tight">
              {selectedBookingEvent.title}
            </h3>

            <div className="mt-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 space-y-1">
              <p><strong>Tempat:</strong> {selectedBookingEvent.venue}, {selectedBookingEvent.city}</p>
              <p><strong>Waktu:</strong> {selectedBookingEvent.day} {selectedBookingEvent.month} {selectedBookingEvent.year} • {selectedBookingEvent.time}</p>
              <p><strong>Harga Satuan:</strong> Rp {selectedBookingEvent.priceLabel}</p>
            </div>

            {/* Info kategori tiket */}
            <div className="mt-4 rounded-2xl border border-brand-200 bg-brand-50/70 p-3.5">
              <p className="text-xs font-bold text-slate-800">Pilih kategori tiket dulu</p>
              <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500">
                Early Bird, Reguler, atau Bundling — masing-masing punya harga &amp; kuota berbeda.
              </p>
            </div>

            {/* Confirmation CTA */}
            <div className="mt-4 space-y-2">
              <Link
                href={`/event/${selectedBookingEvent.slug}/tiket`}
                onClick={() => setSelectedBookingEvent(null)}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-brand-600 to-brand-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-600/25 transition-all hover:from-brand-700 hover:to-brand-600 active:scale-95"
              >
                Pilih Kategori Tiket
                <Icon name="arrowRight" className="h-4 w-4" />
              </Link>
              <p className="text-[10px] text-slate-400 text-center">
                Pembayaran terlindungi enkripsi 256-bit dan garansi tiket resmi.
              </p>
              <Link
                href={`/event/${selectedBookingEvent.slug}`}
                className="block text-center text-xs font-bold text-brand-700 hover:underline"
              >
                Lihat detail lengkap event
              </Link>
            </div>

          </div>
        </div>
      )}
    </section>
  );
}
