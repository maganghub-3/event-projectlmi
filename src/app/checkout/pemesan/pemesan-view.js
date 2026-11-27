"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Navbar from "@/app/landing/Navbar";
import Icon from "@/app/landing/Icon";
import SiteFooter from "@/components/layout/site-footer";
import BookingSteps from "@/components/booking/booking-steps";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import notify from "@/lib/sweetalert";
import { getEventBySlug } from "@/app/landing/data";
import { getLatestDraft, makeAttendees, saveAttendees } from "@/lib/booking-store";
import { identityLabel } from "@/constants/identity";
import { pemesanSchema, IDENTITY_OPTIONS } from "@/lib/schemas/pemesan";

const MONTH_NAMES = {
  JAN: "Januari", FEB: "Februari", MAR: "Maret", APR: "April",
  MEI: "Mei", JUN: "Juni", JUL: "Juli", AGU: "Agustus",
  SEP: "September", OKT: "Oktober", NOV: "November", DES: "Desember",
};

const FIELD_CLASS =
  "h-12 rounded-xl border-slate-200 bg-slate-50/60 focus-visible:ring-brand-200";

function formatRupiah(value) {
  return `Rp ${value.toLocaleString("id-ID")}`;
}

export default function PemesanView() {
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [invalid, setInvalid] = useState(false);

  const form = useForm({
    resolver: zodResolver(pemesanSchema),
    defaultValues: { attendees: [] },
    mode: "onBlur",
  });
  const { control, reset, handleSubmit, formState } = form;
  const { fields } = useFieldArray({ control, name: "attendees" });
  const watchedAttendees = useWatch({ control, name: "attendees" });

  useEffect(() => {
    Promise.resolve().then(() => {
      const draft = getLatestDraft();
      if (!draft) {
        setLoading(false);
        return;
      }

      const foundEvent = getEventBySlug(draft.eventSlug);
      const ticketCount = draft.qty * (draft.ticketCount || 1);
      if (!foundEvent || ticketCount > Math.max(0, foundEvent.spotsLeft)) {
        setInvalid(true);
        setLoading(false);
        return;
      }

      const initial =
        draft.attendees?.length === ticketCount
          ? draft.attendees
          : makeAttendees(ticketCount);

      reset({ attendees: initial });
      setOrder(draft);
      setEvent(foundEvent);
      setLoading(false);
    });
  }, [reset]);

  const onSubmit = (data) => {
    if (!order) return;
    saveAttendees(order.id, data.attendees);
    notify.success("Detail pemesan tersimpan. Lanjut ke pembayaran.");
    router.push("/checkout");
  };

  return (
    <div className="min-h-screen bg-[#F7F8FC] text-slate-800 flex flex-col font-sans">
      <Navbar />

      <main className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-8 pb-16">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Link href="/" className="hover:text-brand-700 transition">Beranda</Link>
          <span className="text-slate-300">/</span>
          <span className="text-slate-700">Detail Pemesan</span>
        </nav>

        {loading ? (
          <div className="mt-8 h-72 animate-pulse rounded-3xl bg-white" />
        ) : invalid ? (
          <div className="mt-8 rounded-3xl border border-amber-200 bg-amber-50 p-8 text-center">
            <Icon name="alert" className="mx-auto h-10 w-10 text-amber-600" />
            <h1 className="mt-3 text-lg font-extrabold text-slate-900">Pesanan tidak valid</h1>
            <p className="mt-1 text-sm text-slate-600">
              Sisa tiket berubah atau event tidak ditemukan. Silakan pesan ulang.
            </p>
            <Link
              href="/#event"
              className="mt-4 inline-flex rounded-xl bg-brand-600 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-brand-700"
            >
              Lihat Event
            </Link>
          </div>
        ) : !order || !event ? (
          <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <Icon name="ticket" className="mx-auto h-12 w-12 text-slate-300" />
            <h1 className="mt-3 text-lg font-extrabold text-slate-900">Belum ada pesanan</h1>
            <p className="mt-1 text-sm text-slate-500">
              Pilih kategori tiket event terlebih dahulu.
            </p>
            <Link
              href="/#event"
              className="mt-4 inline-flex rounded-xl bg-brand-600 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-brand-700"
            >
              Jelajahi Event
            </Link>
          </div>
        ) : (
          <>
            <Link
              href={`/event/${event.slug}/tiket`}
              className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 hover:underline"
            >
              <Icon name="arrowLeft" className="h-4 w-4" />
              Kembali ke Kategori Tiket
            </Link>

            <div className="mt-4">
              <BookingSteps current={2} />
            </div>

            <h1 className="mt-6 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              Detail Pemesan
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Isi identitas untuk setiap tiket yang dipesan, lalu lanjut ke pembayaran.
            </p>

            <div className="mt-5 flex items-center gap-4 rounded-3xl border border-slate-200/80 bg-white p-4 sm:p-5">
              <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-2xl bg-slate-100">
                <Image src={event.image} alt={event.alt} fill sizes="112px" className="object-cover" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-wider text-brand-600">
                  {order.ticketTypeName} • {fields.length} tiket
                </p>
                <h2 className="mt-0.5 truncate text-base font-extrabold text-slate-900 sm:text-lg">
                  {event.title}
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  {event.day} {MONTH_NAMES[event.month] || event.month} {event.year} • {event.venue}
                </p>
              </div>
            </div>

            <Form {...form}>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="mt-5 grid gap-6 lg:grid-cols-12 lg:items-start"
              >
                <section className="space-y-4 lg:col-span-8">
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-6"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h2 className="text-sm font-extrabold text-slate-900">
                          {index === 0 ? "Pemesan (Tiket 1)" : `Peserta Tiket ${index + 1}`}
                        </h2>
                        <span className="rounded-full bg-brand-50 px-2.5 py-1 text-[10px] font-bold text-brand-700">
                          Tiket {index + 1}
                        </span>
                      </div>

                      <div className="mt-4 grid gap-4 sm:grid-cols-2">
                        <FormField
                          control={control}
                          name={`attendees.${index}.name`}
                          render={({ field: input }) => (
                            <FormItem className="sm:col-span-2">
                              <FormLabel>Nama Lengkap</FormLabel>
                              <FormControl>
                                <Input {...input} placeholder="Sesuai identitas" className={FIELD_CLASS} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={control}
                          name={`attendees.${index}.phone`}
                          render={({ field: input }) => (
                            <FormItem>
                              <FormLabel>Nomor WhatsApp</FormLabel>
                              <FormControl>
                                <Input {...input} inputMode="tel" placeholder="08xx-xxxx-xxxx" className={FIELD_CLASS} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={control}
                          name={`attendees.${index}.email`}
                          render={({ field: input }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input {...input} type="email" placeholder="nama@email.com" className={FIELD_CLASS} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={control}
                          name={`attendees.${index}.identityType`}
                          render={({ field: input }) => (
                            <FormItem>
                              <FormLabel>Tipe Identitas</FormLabel>
                              <Select
                                onValueChange={input.onChange}
                                value={input.value}
                                defaultValue={input.value}
                              >
                                <FormControl>
                                  <SelectTrigger className={`${FIELD_CLASS} w-full`}>
                                    <SelectValue placeholder="Pilih identitas" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {IDENTITY_OPTIONS.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={control}
                          name={`attendees.${index}.identityNumber`}
                          render={({ field: input }) => (
                            <FormItem>
                              <FormLabel>Nomor Identitas</FormLabel>
                              <FormControl>
                                <Input
                                  {...input}
                                  placeholder={
                                    watchedAttendees?.[index]?.identityType === "ktp"
                                      ? "16 digit nomor KTP"
                                      : "Nomor identitas"
                                  }
                                  className={FIELD_CLASS}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  ))}

                  <p className="rounded-xl bg-slate-100 px-3 py-2 text-[11px] leading-relaxed text-slate-500">
                    Identitas digunakan untuk verifikasi di lokasi. Detail jenis kelamin akan ditambahkan pada tahap berikutnya.
                  </p>

                  <button
                    type="submit"
                    disabled={formState.isSubmitting}
                    className="w-full rounded-2xl bg-gradient-to-r from-brand-600 to-brand-500 py-4 text-sm font-extrabold text-white shadow-lg shadow-brand-600/20 transition hover:from-brand-700 hover:to-brand-600 active:scale-95 disabled:opacity-60"
                  >
                    {formState.isSubmitting
                      ? "Menyimpan..."
                      : "Lanjut ke Pembayaran"}
                  </button>
                </section>

                <aside className="lg:col-span-4">
                  <div className="lg:sticky lg:top-24 rounded-3xl border border-slate-200/80 bg-white p-6">
                    <h2 className="text-sm font-extrabold text-slate-900">Ringkasan Pesanan</h2>
                    <p className="mt-0.5 font-mono text-[11px] text-slate-400">{order.id}</p>

                    <div className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-xs">
                      <div className="flex justify-between text-slate-500">
                        <span>{order.ticketTypeName} × {order.qty} paket</span>
                        <span className="font-semibold text-slate-700">{formatRupiah(order.total)}</span>
                      </div>
                      <div className="flex justify-between text-slate-500">
                        <span>Total tiket</span>
                        <span className="font-semibold text-slate-700">{fields.length} tiket</span>
                      </div>
                      <div className="flex justify-between text-slate-500">
                        <span>Biaya layanan</span>
                        <span className="font-bold text-emerald-600">Gratis</span>
                      </div>
                    </div>

                    <div className="mt-4 flex items-end justify-between border-t border-slate-100 pt-4">
                      <span className="text-xs font-bold text-slate-500">Total Pembayaran</span>
                      <span className="text-xl font-black text-brand-700">{formatRupiah(order.total)}</span>
                    </div>

                    <div className="mt-4 space-y-1.5 rounded-xl bg-brand-50/60 p-3">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-brand-600">
                        Identitas terisi
                      </p>
                      {watchedAttendees?.map((person, index) => (
                        <p key={index} className="text-[11px] text-slate-600">
                          Tiket {index + 1}:{" "}
                          <span className="font-semibold">
                            {person?.name || "-"} •{" "}
                            {person?.identityNumber
                              ? identityLabel(person.identityType)
                              : "-"}
                          </span>
                        </p>
                      ))}
                    </div>

                    <Link
                      href={`/event/${event.slug}/tiket`}
                      className="mt-4 block text-center text-xs font-bold text-brand-700 hover:underline"
                    >
                      Ubah kategori tiket
                    </Link>
                  </div>
                </aside>
              </form>
            </Form>
          </>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
