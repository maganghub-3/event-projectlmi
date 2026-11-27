"use client";

import { useState } from "react";
import Icon from "@/app/landing/Icon";
import Button from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import notify from "@/lib/sweetalert";
import { useRequireRole } from "@/lib/useRequireRole";
import {
  addEvent,
  clearDraft,
  createEventId,
  formatRupiah,
  saveDraft,
} from "@/app/dashboard-eo/_data/eo-dashboard-data";

const STEPS = ["Info Dasar", "Tiket", "Pratinjau", "Publikasi"];

const DEFAULT_VALUES = {
  title: "",
  category: "musik",
  city: "",
  venue: "",
  date: "",
  description: "",
  ticketName: "Reguler",
  price: 100000,
  quota: 200,
  saleStart: "",
  saleEnd: "",
};

const CATEGORIES = [
  { value: "musik", label: "Musik & Konser" },
  { value: "festival", label: "Festival & Kuliner" },
  { value: "workshop", label: "Workshop & Kelas" },
  { value: "seni", label: "Seni & Pameran" },
  { value: "olahraga", label: "Olahraga & Komunitas" },
];

function Field({ label, children }) {
  return (
    <label className="space-y-1.5">
      <span className="block text-xs font-bold text-slate-700">{label}</span>
      {children}
    </label>
  );
}

export default function CreateEventWizard({ onClose, onCreated }) {
  const { user } = useRequireRole("organizer");
  const [step, setStep] = useState(0);
  const [values, setValues] = useState(DEFAULT_VALUES);

  const setValue = (key, value) =>
    setValues((prev) => ({ ...prev, [key]: value }));

  const persistDraft = () => {
    saveDraft(values);
    notify.toast("Draft acara tersimpan otomatis.");
  };

  const handleNext = () => {
    if (step === 0) {
      if (values.title.trim().length < 5) {
        notify.error("Judul event minimal 5 karakter.");
        return;
      }
      if (!values.city.trim() || !values.venue.trim() || !values.date) {
        notify.error("Lengkapi kota, venue, dan tanggal acara.");
        return;
      }
    }
    if (step === 1) {
      if (!values.ticketName.trim() || Number(values.price) <= 0 || Number(values.quota) < 1) {
        notify.error("Lengkapi jenis tiket, harga, dan kuota.");
        return;
      }
    }
    persistDraft();
    setStep((prev) => Math.min(prev + 1, STEPS.length - 1));
  };

  const handleFinish = (status) => {
    const id = createEventId();
    const categoryLabel =
      CATEGORIES.find((cat) => cat.value === values.category)?.label ??
      values.category;

    const newEvent = {
      id,
      penyelenggaraId: user?.penyelenggaraId,
      title: values.title.trim(),
      category: categoryLabel,
      date: values.date,
      city: values.city.trim(),
      venue: values.venue.trim(),
      address: values.venue.trim(),
      price: Number(values.price),
      sold: 0,
      quota: Number(values.quota),
      status,
      balance: 0,
      poster:
        "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80",
      description: values.description.trim() || "Belum ada deskripsi acara.",
      terms: [
        "Tiket resmi hanya dijual melalui LMI Event.",
        "Satu tiket berlaku untuk satu orang.",
      ],
      saleStart: values.saleStart || "-",
      saleEnd: values.saleEnd || "-",
      dailySales: [],
      ticketTypes: [
        {
          id: `tt-${id}-1`,
          name: values.ticketName.trim(),
          price: Number(values.price),
          quota: Number(values.quota),
          sold: 0,
          saleStart: values.saleStart || "-",
          saleEnd: values.saleEnd || "-",
        },
      ],
    };

    const nextEvents = addEvent(newEvent);
    clearDraft();
    onCreated(nextEvents);
    notify.success(
      status === "aktif"
        ? "Acara berhasil dipublikasikan."
        : "Acara disimpan sebagai draft."
    );
    onClose();
  };

  const categoryLabel =
    CATEGORIES.find((cat) => cat.value === values.category)?.label ??
    values.category;

  return (
    <section className="rounded-3xl border border-brand-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-extrabold text-slate-900">Buat Acara Baru</h3>
          <p className="mt-1 text-xs text-slate-500">
            Acara tersimpan sebagai draft di setiap langkah.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            persistDraft();
            onClose();
          }}
          aria-label="Tutup wizard"
          className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
        >
          <Icon name="close" className="h-5 w-5" />
        </button>
      </div>

      {/* Indikator langkah */}
      <ol className="mb-7 flex flex-wrap gap-2">
        {STEPS.map((label, idx) => (
          <li
            key={label}
            className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-bold ${
              idx === step
                ? "bg-brand-600 text-white"
                : idx < step
                  ? "bg-brand-50 text-brand-700"
                  : "bg-slate-100 text-slate-400"
            }`}
          >
            <span>{idx < step ? "✓" : idx + 1}</span>
            {label}
          </li>
        ))}
      </ol>

      {step === 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Field label="Judul Event">
              <Input
                placeholder="Contoh: Konser Amal Musik Nusantara 2026"
                value={values.title}
                onChange={(e) => setValue("title", e.target.value)}
              />
            </Field>
          </div>
          <Field label="Kategori">
            <select
              value={values.category}
              onChange={(e) => setValue("category", e.target.value)}
              className="h-11 w-full rounded-xl border border-input bg-transparent px-3 text-sm"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Kota">
            <Input
              placeholder="Contoh: Surabaya"
              value={values.city}
              onChange={(e) => setValue("city", e.target.value)}
            />
          </Field>
          <Field label="Lokasi / Venue">
            <Input
              placeholder="Contoh: Grand City Hall"
              value={values.venue}
              onChange={(e) => setValue("venue", e.target.value)}
            />
          </Field>
          <Field label="Tanggal Pelaksanaan">
            <Input
              type="date"
              value={values.date}
              onChange={(e) => setValue("date", e.target.value)}
            />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Deskripsi">
              <Textarea
                placeholder="Ceritakan singkat tentang acara ini..."
                value={values.description}
                onChange={(e) => setValue("description", e.target.value)}
              />
            </Field>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Jenis Tiket">
            <Input
              value={values.ticketName}
              onChange={(e) => setValue("ticketName", e.target.value)}
            />
          </Field>
          <Field label="Harga Tiket (Rp)">
            <Input
              type="number"
              min={0}
              value={values.price}
              onChange={(e) => setValue("price", e.target.value)}
            />
          </Field>
          <Field label="Kuota Tiket">
            <Input
              type="number"
              min={1}
              value={values.quota}
              onChange={(e) => setValue("quota", e.target.value)}
            />
          </Field>
          <Field label="Mulai Jual">
            <Input
              type="date"
              value={values.saleStart}
              onChange={(e) => setValue("saleStart", e.target.value)}
            />
          </Field>
          <Field label="Akhir Jual">
            <Input
              type="date"
              value={values.saleEnd}
              onChange={(e) => setValue("saleEnd", e.target.value)}
            />
          </Field>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50/60 p-5 text-sm">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-700">
              {categoryLabel}
            </span>
            <h4 className="mt-1 text-xl font-black text-slate-900">
              {values.title || "Belum ada judul"}
            </h4>
            <p className="mt-1 text-xs text-slate-500">
              {values.date || "-"} • {values.venue || "-"}, {values.city || "-"}
            </p>
          </div>
          <p className="text-xs leading-relaxed text-slate-500">
            {values.description || "Belum ada deskripsi."}
          </p>
          <div className="grid grid-cols-2 gap-3 border-t border-slate-200 pt-4 text-xs">
            <div>
              <p className="text-slate-400">Jenis tiket</p>
              <p className="font-bold text-slate-800">{values.ticketName}</p>
            </div>
            <div>
              <p className="text-slate-400">Harga</p>
              <p className="font-bold text-slate-800">{formatRupiah(values.price)}</p>
            </div>
            <div>
              <p className="text-slate-400">Kuota</p>
              <p className="font-bold text-slate-800">{values.quota} tiket</p>
            </div>
            <div>
              <p className="text-slate-400">Periode jual</p>
              <p className="font-bold text-slate-800">
                {values.saleStart || "-"} s/d {values.saleEnd || "-"}
              </p>
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-dashed border-brand-200 bg-brand-50/40 p-5 text-xs leading-relaxed text-slate-600">
            <p className="font-bold text-slate-800">Siap disimpan?</p>
            <p className="mt-1">
              <strong>Simpan sebagai Draft</strong> membuat acara tersimpan tetapi belum tampil di
              katalog publik. <strong>Publikasikan</strong> langsung membuka penjualan tiket.
            </p>
            <p className="mt-2 text-brand-700">Draft otomatis tersimpan di setiap langkah.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" rounded="xl" onClick={() => handleFinish("draft")}>
              Simpan sebagai Draft
            </Button>
            <Button variant="primary" rounded="xl" onClick={() => handleFinish("aktif")}>
              Publikasikan Acara
            </Button>
          </div>
        </div>
      )}

      <div className="mt-7 flex items-center justify-between border-t border-slate-200 pt-5">
        <Button
          variant="ghost"
          rounded="xl"
          onClick={() => setStep((prev) => Math.max(prev - 1, 0))}
          disabled={step === 0}
        >
          Kembali
        </Button>
        {step < 3 && (
          <Button variant="primary" rounded="xl" onClick={handleNext}>
            Lanjut
          </Button>
        )}
      </div>
    </section>
  );
}
