"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Icon from "@/app/landing/Icon";
import Button from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import notify from "@/lib/sweetalert";
import { useRequireRole } from "@/lib/useRequireRole";
import {
  deleteEventById,
  getAttendeesByEvent,
  getEventById,
  getStatusLabel,
  getStatusVariant,
  setAttendeeCheckedIn,
  updateEvent,
} from "@/app/dashboard-eo/_data/eo-dashboard-data";
import {
  InfoPanel,
  LaporanPanel,
  PengaturanPanel,
  PesananPanel,
  PesertaPanel,
  RingkasanPanel,
  TiketPanel,
} from "./event-panels";

export default function EventWorkspace({ eventId, tab = "ringkasan" }) {
  const router = useRouter();
  const { user } = useRequireRole("organizer");

  const initialEvent = getEventById(eventId);
  const [event, setEvent] = useState(initialEvent);
  const [attendees, setAttendees] = useState(() =>
    getAttendeesByEvent(eventId)
  );

  const isOwned =
    Boolean(user?.penyelenggaraId) &&
    initialEvent?.penyelenggaraId === user.penyelenggaraId;

  if (!initialEvent || !isOwned) {
    return (
      <div className="rounded-3xl border border-slate-200/90 bg-white p-10 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
          <Icon name="ticket" className="h-7 w-7" />
        </div>
        <h2 className="mt-4 text-xl font-extrabold text-slate-900">
          Event tidak ditemukan
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Event yang Anda cari tidak tersedia atau bukan milik akun Anda.
        </p>
        <Button href="/dashboard-eo" variant="primary" rounded="xl" className="mt-5">
          Kembali ke Dashboard EO
        </Button>
      </div>
    );
  }

  const handleToggleCheckIn = (orderId) => {
    const row = attendees.find((item) => item.id === orderId);
    if (!row) return;

    setAttendeeCheckedIn(orderId, !row.checkedIn);
    setAttendees(getAttendeesByEvent(eventId));
    notify.toast(`Status check-in ${orderId} diperbarui`);
  };

  const handleEventChange = (patch) => {
    setEvent(updateEvent(eventId, patch));
  };

  const handleDeleted = () => {
    deleteEventById(eventId);
    router.push("/dashboard-eo");
  };

  const shared = { event, attendees, onToggleCheckIn: handleToggleCheckIn };

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/dashboard-eo"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 transition hover:text-slate-900"
        >
          <Icon name="arrowLeft" className="h-4 w-4" />
          Acara Saya
        </Link>
      </div>

      <section className="flex flex-col gap-4 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-brand-700">
            {event.category}
          </span>
          <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-900">
            {event.title}
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            {event.date} • {event.venue}, {event.city}
          </p>
        </div>
        <Badge variant={getStatusVariant(event.status)} className="self-start">
          {getStatusLabel(event.status)}
        </Badge>
      </section>

      {/* Menu Tingkat 2 ada di sidebar kiri (lihat eo-dashboard-shell.js) */}

      {tab === "ringkasan" && <RingkasanPanel {...shared} />}
      {tab === "info" && <InfoPanel event={event} />}
      {tab === "tiket" && <TiketPanel event={event} />}
      {tab === "pesanan" && <PesananPanel {...shared} />}
      {tab === "peserta" && <PesertaPanel {...shared} />}
      {tab === "laporan" && <LaporanPanel {...shared} />}
      {tab === "pengaturan" && (
        <PengaturanPanel
          event={event}
          onEventChange={handleEventChange}
          onDeleted={handleDeleted}
        />
      )}
    </div>
  );
}
