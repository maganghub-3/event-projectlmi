import { Suspense } from "react";
import Image from "next/image";
import Icon from "@/app/landing/Icon";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import Button from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BRAND } from "@/constants/brand";
import { getStoryBySlug, COLLABORATION_STORIES } from "@/data/blog-stories";
import ShareButton from "./ShareButton";

export async function generateStaticParams() {
  return COLLABORATION_STORIES.map((story) => ({
    slug: story.slug,
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const story = getStoryBySlug(slug);

  if (!story) {
    return {
      title: `Cerita Event Tidak Ditemukan - ${BRAND.name}`,
    };
  }

  return {
    title: `${story.title} | ${BRAND.name}`,
    description: story.summary,
  };
}

export default function BlogDetailPage({ params }) {
  return (
    <div className="min-h-screen bg-[#F7F8FC] text-slate-800 flex flex-col font-sans">
      {/* 1. TOP HEADER / NAVBAR (statis, tidak bergantung URL) */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-500 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
              <Icon name="ticket" className="h-4 w-4 text-white" />
            </div>
            <span className="font-extrabold text-lg tracking-tight text-slate-900">
              {BRAND.name}<span className="text-brand-600">.</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Button href="/#blog" variant="ghost" size="sm" rounded="full">
              ← Semua Kilas Event
            </Button>
            <Button href="/authentication/login" variant="primary" size="sm" rounded="full">
              Masuk
            </Button>
          </div>
        </div>
      </header>

      {/* Konten artikel bergantung pada `params` URL. Dibungkus <Suspense>
          agar App Shell tetap statis dan navigasi tetap instan. */}
      <Suspense fallback={<BlogArticleSkeleton />}>
        <BlogArticle params={params} />
      </Suspense>

      {/* 9. FOOTER SEDERHANA */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-400">
        <p>{BRAND.copyright}</p>
      </footer>
    </div>
  );
}

function BlogArticleSkeleton() {
  return (
    <main
      role="status"
      aria-live="polite"
      className="max-w-4xl mx-auto w-full px-4 sm:px-6 pt-8 pb-20 animate-pulse"
    >
      <span className="sr-only">Memuat cerita event…</span>
      <div className="h-3 w-44 rounded-full bg-slate-200" />

      <div className="mt-8 space-y-3">
        <div className="h-4 w-28 rounded-full bg-slate-200" />
        <div className="h-9 w-full rounded-2xl bg-slate-200" />
        <div className="h-9 w-4/5 rounded-2xl bg-slate-200" />
      </div>

      <div className="mt-6 flex items-center gap-3 border-y border-slate-200/80 py-4">
        <div className="h-10 w-10 rounded-full bg-slate-200" />
        <div className="space-y-2">
          <div className="h-3 w-40 rounded-full bg-slate-200" />
          <div className="h-3 w-56 rounded-full bg-slate-200" />
        </div>
      </div>

      <div className="mt-8 h-64 sm:h-80 rounded-3xl bg-slate-200" />

      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-24 rounded-2xl bg-slate-200" />
        ))}
      </div>
    </main>
  );
}

async function BlogArticle({ params }) {
  const { slug } = await params;
  const story = getStoryBySlug(slug);

  if (!story) {
    notFound();
  }

  // Rekomendasi liputan event lainnya
  const otherStories = COLLABORATION_STORIES.filter((s) => s.id !== story.id).slice(0, 2);

  return (
    <>
      {/* 2. BREADCRUMBS */}
      <nav aria-label="Breadcrumb" className="max-w-4xl mx-auto w-full px-4 sm:px-6 pt-8 pb-3">
        <ol className="flex items-center gap-2 text-xs text-slate-500">
          <li>
            <Link href="/" className="hover:text-brand-600 transition">Beranda</Link>
          </li>
          <li>/</li>
          <li>
            <Link href="/#blog" className="hover:text-brand-600 transition">Kilas &amp; Berita</Link>
          </li>
          <li>/</li>
          <li className="text-slate-800 font-semibold truncate max-w-[200px] sm:max-w-xs">
            {story.partner}
          </li>
        </ol>
      </nav>

      {/* 3. HERO ARTICLE HEADER */}
      <main className="max-w-4xl mx-auto w-full px-4 sm:px-6 pb-20">
        <article className="space-y-8">
          
          <header className="space-y-4">
            <div className="flex flex-wrap items-center gap-2.5">
              <Badge variant="secondary" className="bg-brand-50 text-brand-700 border-brand-200 font-bold px-3 py-1">
                {story.categoryLabel}
              </Badge>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs font-medium text-slate-500">
                <Icon name="clock" className="h-3.5 w-3.5" /> {story.readTime}
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                ✓ Event Selesai Berlangsung
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              {story.title}
            </h1>

            {/* Meta info author & partner */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-y border-slate-200/80 py-4 text-xs text-slate-600">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-700 font-bold flex items-center justify-center text-sm">
                  <Icon name="building" className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-sm">{story.partner}</div>
                  <div className="text-slate-500"><Icon name="mapPin" className="h-3.5 w-3.5" /> {story.location} • {story.date}</div>
                </div>
              </div>

              <ShareButton title={story.title} />
            </div>
          </header>

          {/* 4. VISUAL BANNER */}
          <div className={`relative rounded-3xl h-64 sm:h-80 bg-gradient-to-tr ${story.gradient} p-8 flex flex-col justify-between text-white shadow-lg overflow-hidden`}>
            {story.photo && (
              <>
                <Image
                  src={story.photo}
                  alt={`Dokumentasi ${story.title}`}
                  fill
                  loading="eager"
                  fetchPriority="high"
                  sizes="(max-width: 1023px) 100vw, 896px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/45 to-slate-950/20 pointer-events-none" />
              </>
            )}
            <div className="flex items-center justify-between z-10">
              <span className="text-xs font-mono font-bold bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-full">
                Dokumentasi Kemitraan {BRAND.name}
              </span>
              <Icon name="ticket" className="h-10 w-10" />
            </div>

            <div className="z-10 max-w-xl">
              <p className="text-sm sm:text-base font-medium text-white/90 leading-relaxed italic">
                {story.summary}
              </p>
            </div>

            <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          </div>

          {/* 5. METRICS HIGHLIGHT CARDS */}
          <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <Card className="p-4 text-center border-slate-200/90 bg-white">
              <Icon name="ticket" className="h-5 w-5 text-brand-600" />
              <div className="text-lg sm:text-xl font-black text-brand-700 mt-1">
                {story.metrics.tickets}
              </div>
              <div className="text-[11px] font-semibold text-slate-500 mt-0.5">
                Kapasitas Terjual
              </div>
            </Card>

            <Card className="p-4 text-center border-slate-200/90 bg-white">
              <Icon name="sparkles" className="h-5 w-5 text-brand-600" />
              <div className="text-lg sm:text-xl font-black text-brand-700 mt-1">
                {story.metrics.scanSpeed}
              </div>
              <div className="text-[11px] font-semibold text-slate-500 mt-0.5">
                Kecepatan Gate
              </div>
            </Card>

            <Card className="p-4 text-center border-slate-200/90 bg-white">
              <Icon name="trendingUp" className="h-5 w-5 text-brand-600" />
              <div className="text-lg sm:text-xl font-black text-brand-700 mt-1">
                {story.metrics.soldOutTime}
              </div>
              <div className="text-[11px] font-semibold text-slate-500 mt-0.5">
                Target Penjualan
              </div>
            </Card>

            <Card className="p-4 text-center border-slate-200/90 bg-white">
              <Icon name="star" className="h-5 w-5 text-brand-600" />
              <div className="text-lg sm:text-xl font-black text-brand-700 mt-1">
                {story.metrics.satisfaction}
              </div>
              <div className="text-[11px] font-semibold text-slate-500 mt-0.5">
                Kepuasan Peserta
              </div>
            </Card>
          </section>

          {/* 6. ARTICLE BODY CONTENT */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm space-y-8">
            
            {/* Gambaran Umum */}
            <div className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Tentang Penyelenggaraan Acara
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {story.overview}
              </p>
            </div>

            {/* Tantangan yang Dihadapi */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                <Icon name="alert" className="h-5 w-5 text-amber-600" /> Tantangan Promotor
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                Kebutuhan Lapangan Sebelum Berkolaborasi
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {story.challenge}
              </p>
            </div>

            {/* Solusi LMI Event */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-2.5 py-1 rounded-md border border-brand-200">
                <Icon name="sparkles" className="h-5 w-5 text-brand-600" /> Solusi Teknologi {BRAND.name}
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                Integrasi Sistem Ticketing &amp; Gate Scanner Cepat
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {story.solution}
              </p>
            </div>

            {/* Hasil Nyata & Metrik Keberhasilan */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">
                Hasil Nyata Penyelenggaraan:
              </h2>
              <ul className="space-y-2.5">
                {story.results.map((res, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-slate-700">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-xs mt-0.5">
                      ✓
                    </span>
                    <span>{res}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Testimoni Promotor Callout */}
            <blockquote className="rounded-2xl border-l-4 border-brand-600 bg-brand-50/60 p-6 sm:p-7 space-y-3">
              <p className="text-base sm:text-lg font-medium text-slate-900 italic leading-relaxed">
                {story.quote}
              </p>
              <footer className="text-xs font-bold text-brand-700">
                — {story.partnerRep}
              </footer>
            </blockquote>

          </div>

          {/* 7. REKOMENDASI CERITA KERJASAMA LAINNYA */}
          {otherStories.length > 0 && (
            <section className="space-y-4 pt-8">
              <h3 className="text-lg font-bold text-slate-900">
                Kilas Event Lainnya yang Telah Berlangsung
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {otherStories.map((other) => (
                  <Link
                    key={other.id}
                    href={`/blog/${other.slug}`}
                    className="group block p-5 rounded-2xl border border-slate-200 bg-white hover:border-brand-300 hover:shadow-md transition-all"
                  >
                    <div className="text-xs font-bold text-brand-600 uppercase tracking-wider mb-1">
                      {other.categoryLabel} • {other.city}
                    </div>
                    <h4 className="font-bold text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-2">
                      {other.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-2 line-clamp-2">
                      {other.summary}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* 8. CALL TO ACTION PENYELENGGARA */}
          <section className="rounded-3xl bg-gradient-to-r from-brand-600 to-brand-700 text-white p-8 sm:p-10 text-center space-y-4 shadow-xl shadow-brand-600/20">
            <Icon name="sparkles" className="inline-block h-8 w-8" />
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
              Ingin Event Anda Berikutnya Sesukses Ini?
            </h3>
            <p className="text-white/90 text-sm max-w-lg mx-auto leading-relaxed">
              Bergabunglah dengan ratusan promotor terpercaya di Indonesia. Buat event Anda gratis di {BRAND.name} dan nikmati sistem gate check-in tercepat.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Button href="/authentication/login?redirect=/organizer" variant="white" size="lg" rounded="full">
                Mulai Buat Event
              </Button>
              <Button href="/#blog" variant="outline" size="lg" rounded="full" className="bg-white/10 text-white border-white/30 hover:bg-white/20">
                Lihat Semua Kilas Event
              </Button>
            </div>
          </section>

        </article>
      </main>
    </>
  );
}
