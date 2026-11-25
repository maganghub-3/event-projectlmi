import { Suspense } from "react";
import { notFound } from "next/navigation";
import Navbar from "@/app/landing/Navbar";
import SiteFooter from "@/components/layout/site-footer";
import { BRAND } from "@/constants/brand";
import { getEventBySlug, INITIAL_EVENTS } from "@/app/landing/data";
import EventDetailView from "./event-detail-view";

export function generateStaticParams() {
  return INITIAL_EVENTS.map((event) => ({ slug: event.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const event = getEventBySlug(slug);

  if (!event) {
    return {
      title: `Event Tidak Ditemukan - ${BRAND.name}`,
    };
  }

  return {
    title: `${event.title} - ${BRAND.name}`,
    description: `${event.description[0].slice(0, 155)}...`,
  };
}

export default function EventDetailPage({ params }) {
  return (
    <div className="min-h-screen bg-[#F7F8FC] text-slate-800 flex flex-col font-sans selection:bg-brand-200 selection:text-brand-900">
      <Navbar />

      {/* Konten bergantung pada `params` URL, dibungkus Suspense agar
          App Shell tetap statis dan navigasi tetap instan. */}
      <Suspense fallback={<EventDetailSkeleton />}>
        <EventContent params={params} />
      </Suspense>

      <SiteFooter />
    </div>
  );
}

async function EventContent({ params }) {
  const { slug } = await params;
  const event = getEventBySlug(slug);

  if (!event) notFound();

  return <EventDetailView event={event} />;
}

function EventDetailSkeleton() {
  return (
    <main
      role="status"
      aria-live="polite"
      className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 pb-16 animate-pulse"
    >
      <div className="h-3 w-48 rounded-full bg-slate-200" />
      <div className="mt-4 aspect-[16/9] sm:aspect-[21/8] rounded-3xl bg-slate-200" />
      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8 space-y-4">
          <div className="h-8 w-3/4 rounded-xl bg-slate-200" />
          <div className="h-4 w-1/2 rounded-lg bg-slate-200" />
          <div className="h-40 rounded-3xl bg-slate-200" />
        </div>
        <div className="lg:col-span-4">
          <div className="h-64 rounded-3xl bg-slate-200" />
        </div>
      </div>
      <span className="sr-only">Memuat detail event</span>
    </main>
  );
}
