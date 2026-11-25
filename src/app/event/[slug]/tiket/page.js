import { Suspense } from "react";
import { notFound } from "next/navigation";
import Navbar from "@/app/landing/Navbar";
import SiteFooter from "@/components/layout/site-footer";
import { BRAND } from "@/constants/brand";
import { getEventBySlug, INITIAL_EVENTS } from "@/app/landing/data";
import TicketTypesView from "./ticket-types-view";

export function generateStaticParams() {
  return INITIAL_EVENTS.map((event) => ({ slug: event.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const event = getEventBySlug(slug);

  if (!event) {
    return { title: `Tiket Event Tidak Ditemukan - ${BRAND.name}` };
  }

  return {
    title: `Pilih Tiket - ${event.title} | ${BRAND.name}`,
    description: `Pilih kategori tiket Early Bird, Reguler, atau Bundling untuk ${event.title}.`,
  };
}

export default function TicketTypesPage({ params }) {
  return (
    <div className="min-h-screen bg-[#F7F8FC] text-slate-800 flex flex-col font-sans">
      <Navbar />

      {/* Konten bergantung pada params URL, dibungkus Suspense agar shell tetap statis. */}
      <Suspense fallback={<TicketTypesSkeleton />}>
        <TicketTypesContent params={params} />
      </Suspense>

      <SiteFooter />
    </div>
  );
}

async function TicketTypesContent({ params }) {
  const { slug } = await params;
  const event = getEventBySlug(slug);

  if (!event) notFound();

  return <TicketTypesView event={event} />;
}

function TicketTypesSkeleton() {
  return (
    <main role="status" aria-live="polite" className="max-w-5xl mx-auto w-full px-4 py-10 animate-pulse">
      <div className="h-3 w-40 rounded bg-slate-200" />
      <div className="mt-5 h-8 w-2/3 rounded-xl bg-slate-200" />
      <div className="mt-8 grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8 space-y-4">
          <div className="h-40 rounded-3xl bg-slate-200" />
          <div className="h-40 rounded-3xl bg-slate-200" />
        </div>
        <div className="lg:col-span-4 h-64 rounded-3xl bg-slate-200" />
      </div>
      <span className="sr-only">Memuat kategori tiket</span>
    </main>
  );
}
