"use client";

/* eslint-disable @next/next/no-img-element */
import { useState, useEffect, useRef, useCallback } from "react";
import Icon from "./Icon";

// ============================================================================
// DATA BANNER GAMBAR (CUSTOM BANNER UNTUK KEBUTUHAN WEBSITE ANDA)
// ============================================================================
// Cukup ganti URL gambar di bawah dengan gambar banner promo/event buatan Anda
// (Bisa dari file lokal di folder /public, URL Canva, Figma, CDN, dll).
// ============================================================================
export const DEFAULT_BANNERS = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1600&q=85",
    alt: "Banner Promo 1",
    link: "#",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1600&q=85",
    alt: "Banner Promo 2",
    link: "#",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1600&q=85",
    alt: "Banner Promo 3",
    link: "#",
  },
  {
    id: 4,
    image: "/images/banner/hogwarts.jpg",
    alt: "Banner Promo 4",
    link: "#",
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1600&q=85",
    alt: "Banner Promo 5",
    link: "#",
  },
];

export default function HeroBanner({
  banners = DEFAULT_BANNERS,
  autoPlayInterval = 4000,
  onSlideClick,
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const dragStartXRef = useRef(0);
  const isMouseDownRef = useRef(false);

  const total = banners.length;

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Auto-scroll bergantian
  useEffect(() => {
    if (isPaused || isDragging) return;
    const interval = setInterval(() => {
      nextSlide();
    }, autoPlayInterval);
    return () => clearInterval(interval);
  }, [isPaused, isDragging, nextSlide, autoPlayInterval]);

  // Touch Swipe Handlers (HP / Mobile)
  const handleTouchStart = (e) => {
    dragStartXRef.current = e.touches[0].clientX;
    setIsDragging(true);
    setDragOffset(0);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - dragStartXRef.current;
    setDragOffset(Math.max(-140, Math.min(140, diff)));
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    if (dragOffset < -45) {
      nextSlide();
    } else if (dragOffset > 45) {
      prevSlide();
    }
    setIsDragging(false);
    setDragOffset(0);
  };

  // Mouse Drag Handlers (Desktop)
  const handleMouseDown = (e) => {
    dragStartXRef.current = e.clientX;
    isMouseDownRef.current = true;
    setIsDragging(true);
    setDragOffset(0);
  };

  const handleMouseMove = (e) => {
    if (!isMouseDownRef.current) return;
    const diff = e.clientX - dragStartXRef.current;
    setDragOffset(Math.max(-140, Math.min(140, diff)));
  };

  const handleMouseUp = () => {
    if (!isMouseDownRef.current) return;
    isMouseDownRef.current = false;
    if (dragOffset < -45) {
      nextSlide();
    } else if (dragOffset > 45) {
      prevSlide();
    }
    setIsDragging(false);
    setDragOffset(0);
  };

  return (
    <div
      className="relative w-full max-w-7xl mx-auto px-2 sm:px-4 select-none my-4 sm:my-6"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => {
        setIsPaused(false);
        handleMouseUp();
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* 3D COVERFLOW STACK BANNER (GAYA ARTATIX - GAMBAR TOK) */}
      <div 
        className="relative w-full h-[180px] xs:h-[220px] sm:h-[280px] md:h-[340px] lg:h-[370px] flex items-center justify-center overflow-hidden py-2 sm:py-4"
        style={{ perspective: "1200px" }}
      >
        {banners.map((item, idx) => {
          let offset = (idx - activeIndex) % total;
          if (offset < -Math.floor(total / 2)) offset += total;
          if (offset > Math.floor(total / 2)) offset -= total;

          let transformStyle = "";
          let zIndex = 1;
          let opacity = 0;
          let pointerEvents = "none";
          let filter = "brightness(0.6)";
          let isClickable = false;

          if (offset === 0) {
            // BANNER UTAMA (TENGAH / AKTIF)
            const dragShift = isDragging ? dragOffset : 0;
            const rotateDeg = isDragging ? dragOffset * 0.03 : 0;
            transformStyle = `translate3d(${dragShift}px, 0, 0) scale(1) rotateY(${rotateDeg}deg)`;
            zIndex = 30;
            opacity = 1;
            filter = "brightness(1)";
            pointerEvents = "auto";
          } else if (offset === 1) {
            // BANNER KANAN TINGKAT 1
            transformStyle = `translate3d(48%, 0, -90px) scale(0.85) rotateY(-8deg)`;
            zIndex = 20;
            opacity = 0.8;
            filter = "brightness(0.85)";
            isClickable = true;
            pointerEvents = "auto";
          } else if (offset === 2) {
            // BANNER KANAN TINGKAT 2
            transformStyle = `translate3d(74%, 0, -180px) scale(0.72) rotateY(-14deg)`;
            zIndex = 10;
            opacity = 0.45;
            filter = "brightness(0.7)";
            isClickable = true;
            pointerEvents = "auto";
          } else if (offset === -1) {
            // BANNER KIRI TINGKAT 1
            transformStyle = `translate3d(-48%, 0, -90px) scale(0.85) rotateY(8deg)`;
            zIndex = 20;
            opacity = 0.8;
            filter = "brightness(0.85)";
            isClickable = true;
            pointerEvents = "auto";
          } else if (offset === -2) {
            // BANNER KIRI TINGKAT 2
            transformStyle = `translate3d(-74%, 0, -180px) scale(0.72) rotateY(14deg)`;
            zIndex = 10;
            opacity = 0.45;
            filter = "brightness(0.7)";
            isClickable = true;
            pointerEvents = "auto";
          } else {
            // SEMBUNYIKAN DI BELAKANG
            transformStyle = `translate3d(0, 0, -300px) scale(0.5)`;
            zIndex = 0;
            opacity = 0;
          }

          return (
            <div
              key={item.id}
              onClick={() => {
                if (isClickable) {
                  setActiveIndex(idx);
                } else if (offset === 0) {
                  if (onSlideClick) {
                    onSlideClick(item, idx);
                  } else if (item.link && item.link !== "#") {
                    window.location.href = item.link;
                  }
                }
              }}
              style={{
                transform: transformStyle,
                zIndex,
                opacity,
                pointerEvents,
                filter,
                transition: isDragging && offset === 0 
                  ? "none" 
                  : "transform 650ms cubic-bezier(0.25, 1, 0.5, 1), opacity 500ms ease, filter 500ms ease",
              }}
              className={`absolute w-[86%] sm:w-[78%] md:w-[72%] lg:w-[68%] max-w-[860px] h-[160px] xs:h-[190px] sm:h-[240px] md:h-[300px] lg:h-[330px] rounded-2xl sm:rounded-[28px] overflow-hidden border-2 sm:border-4 border-white shadow-2xl shadow-slate-900/25 will-change-transform bg-slate-200 ${
                isClickable ? "cursor-pointer hover:filter-none" : "cursor-grab active:cursor-grabbing"
              }`}
            >
              {/* GAMBAR TOK (PURE BANNER IMAGE TANPA OVERLAY TEKS) */}
              <img
                src={item.image}
                alt={item.alt || `Banner ${idx + 1}`}
                className="w-full h-full object-cover pointer-events-none select-none"
                draggable={false}
              />
            </div>
          );
        })}

        {/* FLOATING NAVIGATION ARROWS */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            prevSlide();
          }}
          className="absolute left-1 sm:left-4 md:left-8 top-1/2 -translate-y-1/2 z-40 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 hover:bg-white text-slate-800 hover:text-brand-700 shadow-xl border border-slate-200/80 flex items-center justify-center transition-all hover:scale-110 active:scale-95 backdrop-blur-md"
          aria-label="Banner sebelumnya"
        >
          <Icon name="arrowLeft" className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            nextSlide();
          }}
          className="absolute right-1 sm:right-4 md:right-8 top-1/2 -translate-y-1/2 z-40 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 hover:bg-white text-slate-800 hover:text-brand-700 shadow-xl border border-slate-200/80 flex items-center justify-center transition-all hover:scale-110 active:scale-95 backdrop-blur-md"
          aria-label="Banner berikutnya"
        >
          <Icon name="arrowRight" className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>

      {/* BOTTOM PAGINATION INDICATORS (PERSIS ARTATIX: BULAT-BULAT DENGAN KAPSUL AKTIF) */}
      <div className="flex items-center justify-center gap-3 mt-3">
        <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-200/80 shadow-sm">
          {banners.map((_, dotIdx) => (
            <button
              key={dotIdx}
              type="button"
              onClick={() => setActiveIndex(dotIdx)}
              className={`h-2 transition-all duration-300 rounded-full ${
                dotIdx === activeIndex
                  ? "w-8 bg-brand-600 shadow-sm"
                  : "w-2 bg-slate-300 hover:bg-slate-400"
              }`}
              aria-label={`Pindah ke banner ke-${dotIdx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
