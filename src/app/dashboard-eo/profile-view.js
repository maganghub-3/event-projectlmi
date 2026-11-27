"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import Icon from "@/app/landing/Icon";
import Button from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import notify from "@/lib/sweetalert";
import { normalizePhone } from "@/lib/auth-utils";
import {
  BANK_OPTIONS,
  getOrganizationServerSnapshot,
  getOrganizationSnapshot,
  saveOrganization,
  subscribeProfiles,
} from "@/app/dashboard-eo/_data/eo-dashboard-data";

const today = () =>
  new Date().toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

function docVariant(status) {
  if (status === "Terverifikasi") return "success";
  if (status === "Ditolak" || status === "Kedaluwarsa") return "destructive";
  return "warning";
}

function SectionCard({ id, title, subtitle, dirty, onSave, saveLabel, children }) {
  return (
    <section id={id} className="scroll-mt-24 rounded-3xl border border-slate-200/90 bg-white shadow-sm">
      <div className="p-6">
        <h3 className="text-lg font-extrabold text-slate-900">{title}</h3>
        {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
        <div className="mt-5">{children}</div>
      </div>
      {dirty && (
        <div className="sticky bottom-0 flex flex-wrap items-center justify-between gap-3 rounded-b-3xl border-t border-amber-200 bg-amber-50/95 px-6 py-3 backdrop-blur">
          <span className="inline-flex items-center gap-2 text-xs font-bold text-amber-700">
            <Icon name="alert" className="h-4 w-4" />
            Perubahan belum disimpan
          </span>
          <Button variant="primary" size="sm" rounded="lg" onClick={onSave}>
            {saveLabel}
          </Button>
        </div>
      )}
    </section>
  );
}

export default function ProfileView({ ownerId, actorName }) {
  const initial = useSyncExternalStore(
    subscribeProfiles,
    () => getOrganizationSnapshot(ownerId),
    () => getOrganizationServerSnapshot(ownerId)
  );
  const [draft, setDraft] = useState(initial);
  const [saved, setSaved] = useState(initial);
  const [otpOpen, setOtpOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpCode] = useState(() =>
    String(Math.floor(100000 + Math.random() * 900000))
  );
  const [bankUnlocked, setBankUnlocked] = useState(false);

  const setField = (key, value) =>
    setDraft((prev) => ({ ...prev, [key]: value }));

  const setSocial = (key, value) =>
    setDraft((prev) => ({
      ...prev,
      socials: { ...(prev.socials || {}), [key]: value },
    }));

  const setBank = (key, value) =>
    setDraft((prev) => ({
      ...prev,
      bank: { ...(prev.bank || {}), [key]: value },
    }));

  const dirty = useMemo(() => {
    const pick = (obj, keys) =>
      Object.fromEntries(keys.map((key) => [key, obj?.[key] ?? ""]));
    return {
      profil:
        JSON.stringify(pick(draft, ["name", "picName", "description", "email", "phone", "logo", "logoData"])) !==
        JSON.stringify(pick(saved, ["name", "picName", "description", "email", "phone", "logo", "logoData"])),
      socials: JSON.stringify(draft.socials || {}) !== JSON.stringify(saved.socials || {}),
      bank: JSON.stringify(draft.bank || {}) !== JSON.stringify(saved.bank || {}),
      documents: JSON.stringify(draft.documents || []) !== JSON.stringify(saved.documents || []),
    };
  }, [draft, saved]);

  const hasDirty = Object.values(dirty).some(Boolean);

  useEffect(() => {
    const handler = (event) => {
      if (!hasDirty) return;
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [hasDirty]);

  const commit = (next, message) => {
    setSaved(next);
    setDraft(next);
    saveOrganization(ownerId, next);
    notify.success(message);
  };

  const saveProfil = () => {
    if (!draft.name?.trim()) {
      notify.error("Nama organisasi wajib diisi.");
      return;
    }
    const phone = normalizePhone(draft.phone || "");
    if (!phone) {
      notify.error("Nomor telepon tidak valid. Contoh: 081234567890.");
      return;
    }
    commit({ ...draft, name: draft.name.trim(), phone }, "Profil organisasi disimpan.");
  };

  const saveSocials = () => {
    const socials = { ...(draft.socials || {}) };
    for (const key of ["instagram", "tiktok"]) {
      const handle = String(socials[key] || "").replace(/^@+/, "").trim();
      socials[key] = handle ? `@${handle}` : "";
    }
    let website = String(socials.website || "").trim();
    if (website && !/^https?:\/\//i.test(website)) website = `https://${website}`;
    if (website && !/^https?:\/\/[^\s.]+\.[^\s]+/i.test(website)) {
      notify.error("Alamat website tidak valid.");
      return;
    }
    socials.website = website;
    commit({ ...draft, socials }, "Media sosial disimpan.");
  };

  const saveBank = () => {
    if (!bankUnlocked) {
      notify.error("Verifikasi ulang diperlukan sebelum mengubah rekening.");
      return;
    }

    const number = String(draft.bank?.number || "").replace(/\D/g, "");
    const bank = BANK_OPTIONS.find(
      (option) =>
        option.id === draft.bank?.name || option.label === draft.bank?.name
    );
    if (!bank) {
      notify.error("Pilih nama bank dari daftar.");
      return;
    }
    if (number.length !== bank.length) {
      notify.error(`Nomor rekening ${bank.label} harus ${bank.length} digit.`);
      return;
    }

    if (draft.bank.holder?.trim() !== draft.name?.trim()) {
      notify.warning(
        "Atas nama rekening berbeda dengan nama organisasi. Periksa kembali sebelum menyimpan."
      );
    }

    const entry = {
      id: `BH-${Date.now()}`,
      date: today(),
      actor: actorName || draft.picName || draft.name,
      note: "Rekening diperbarui setelah verifikasi ulang",
    };
    commit(
      {
        ...draft,
        bank: { ...draft.bank, number },
        bankHistory: [entry, ...(draft.bankHistory || [])],
      },
      "Rekening bank disimpan. Notifikasi email telah dikirim."
    );
    setBankUnlocked(false);
  };

  const requestUnlock = () => {
    if (!draft.email) {
      notify.error("Isi email kontak terlebih dahulu untuk verifikasi.");
      return;
    }
    setOtp("");
    setOtpOpen(true);
  };

  const verifyOtp = () => {
    if (otp.trim() === otpCode) {
      setBankUnlocked(true);
      setOtpOpen(false);
      notify.success("Verifikasi berhasil. Rekening dapat diubah.");
    } else {
      notify.error("Kode verifikasi salah. Coba lagi.");
    }
  };

  const handleLogoFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      notify.error("Format harus JPG, PNG, atau WebP.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      notify.error("Ukuran gambar maksimal 2 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        const size = 512;
        const side = Math.min(image.width, image.height);
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        canvas
          .getContext("2d")
          .drawImage(
            image,
            (image.width - side) / 2,
            (image.height - side) / 2,
            side,
            side,
            0,
            0,
            size,
            size
          );
        setField("logoData", canvas.toDataURL("image/jpeg", 0.85));
        notify.toast("Logo dipotong persegi dan siap disimpan.");
      };
      image.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDocumentFile = (docId) => (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () =>
      setDraft((prev) => ({
        ...prev,
        documents: (prev.documents || []).map((doc) =>
          doc.id === docId
            ? {
                ...doc,
                status: "Menunggu verifikasi",
                uploadedAt: today(),
                reason: "",
                url: String(reader.result),
              }
            : doc
        ),
      }));
    reader.readAsDataURL(file);
  };

  const addDocument = () => {
    setDraft((prev) => ({
      ...prev,
      documents: [
        ...(prev.documents || []),
        {
          id: `doc-${Date.now()}`,
          label: "Dokumen pendukung baru",
          status: "Menunggu verifikasi",
          uploadedAt: today(),
          reason: "",
          url: "",
        },
      ],
    }));
  };

  const viewDocument = (doc) => {
    if (doc.url) window.open(doc.url, "_blank", "noopener,noreferrer");
    else notify.info(`Dokumen "${doc.label}" belum diunggah.`);
  };

  const completenessItems = [
    Boolean(draft.name?.trim()),
    Boolean(draft.description?.trim()),
    Boolean(draft.logoData || draft.logo),
    Boolean(draft.email?.trim()),
    Boolean(normalizePhone(draft.phone || "")),
    Boolean(draft.socials?.instagram),
    Boolean(draft.socials?.tiktok),
    Boolean(draft.socials?.website),
    Boolean(draft.bank?.name && draft.bank?.number),
    (draft.documents || []).some((doc) => doc.status === "Terverifikasi"),
  ];
  const completeness = Math.round(
    (completenessItems.filter(Boolean).length / completenessItems.length) * 100
  );

  const maskedNumber = (number = "") =>
    number.length > 4 ? `•••• ${number.slice(-4)}` : number || "-";

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-brand-200 bg-brand-50/60 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-brand-700">Kelengkapan profil</p>
            <p className="mt-1 text-xs text-slate-600">
              {completeness}% data organisasi sudah terisi.
            </p>
          </div>
          <span className="text-2xl font-black text-brand-700">{completeness}%</span>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-white">
          <div
            className="h-full rounded-full bg-brand-600 transition-all"
            style={{ width: `${completeness}%` }}
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          rounded="lg"
          href={`/penyelenggara/${(draft.name || "organisasi")
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")}`}
          className="mt-4"
          leftIcon={<Icon name="eye" className="h-4 w-4" />}
        >
          Lihat tampilan di halaman publik
        </Button>
      </section>

      <SectionCard
        title="Profil Organisasi"
        subtitle="Identitas utama yang tampil di halaman publik dan invoice."
        dirty={dirty.profil}
        onSave={saveProfil}
        saveLabel="Simpan Profil"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="space-y-1.5">
            <span className="text-xs font-bold text-slate-700">Logo Organisasi</span>
            <label className="relative flex h-28 w-28 cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 transition hover:border-brand-400">
              {draft.logoData || draft.logo ? (
                <img
                  src={draft.logoData || draft.logo}
                  alt="Pratinjau logo"
                  className="h-full w-full object-cover"
                />
              ) : (
                <Icon name="camera" className="h-7 w-7 text-slate-400" />
              )}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleLogoFile}
                className="hidden"
                aria-label="Unggah logo organisasi"
              />
            </label>
            <span className="block text-[11px] text-slate-400">
              JPG/PNG/WebP, maksimal 2 MB. Diproteksi menjadi kotak 512×512.
            </span>
          </label>

          {[
            ["name", "Nama Organisasi"],
            ["picName", "Penanggung Jawab"],
            ["email", "Email Kontak"],
            ["phone", "Nomor Telepon"],
          ].map(([key, label]) => (
            <label key={key} className="space-y-1.5">
              <span className="text-xs font-bold text-slate-700">{label}</span>
              <Input
                value={draft[key] ?? ""}
                onChange={(event) => setField(key, event.target.value)}
                className="h-10 rounded-xl text-xs"
              />
            </label>
          ))}

          <label className="space-y-1.5 sm:col-span-2">
            <span className="text-xs font-bold text-slate-700">Deskripsi</span>
            <textarea
              value={draft.description ?? ""}
              onChange={(event) => setField("description", event.target.value)}
              rows={3}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            />
          </label>
        </div>
      </SectionCard>

      <SectionCard
        title="Media Sosial"
        subtitle="Awalan @ dan protokol website ditambahkan otomatis."
        dirty={dirty.socials}
        onSave={saveSocials}
        saveLabel="Simpan Media Sosial"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            ["instagram", "Instagram", "@"],
            ["tiktok", "TikTok", "@"],
            ["website", "Website", "https://"],
          ].map(([key, label, prefix]) => (
            <label key={key} className="space-y-1.5">
              <span className="text-xs font-bold text-slate-700">{label}</span>
              <div className="flex h-10 items-center gap-1 rounded-xl border border-slate-300 px-3 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-100">
                <span className="text-xs font-bold text-slate-400">{prefix}</span>
                <input
                  value={String(draft.socials?.[key] ?? "").replace(/^@+|^https?:\/\//, "")}
                  onChange={(event) => setSocial(key, event.target.value)}
                  className="w-full text-xs outline-none"
                  placeholder={key === "website" ? "namadomain.id" : "username"}
                />
              </div>
            </label>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="Rekening Bank"
        subtitle="Data sensitif — perubahan memerlukan verifikasi ulang."
        dirty={dirty.bank}
        onSave={saveBank}
        saveLabel="Simpan Rekening"
      >
        {!bankUnlocked ? (
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
            <div>
              <p className="text-xs text-slate-500">Nomor rekening tersimpan</p>
              <p className="mt-1 font-mono text-lg font-bold text-slate-900">
                {maskedNumber(draft.bank?.number)}
              </p>
              <p className="text-[11px] text-slate-400">
                {draft.bank?.name} • a.n. {draft.bank?.holder}
              </p>
            </div>
            <Button variant="outline" size="sm" rounded="lg" onClick={requestUnlock}>
              Ubah rekening
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <label className="space-y-1.5">
              <span className="text-xs font-bold text-slate-700">Nama Bank</span>
              <select
                value={draft.bank?.name ?? ""}
                onChange={(event) => setBank("name", event.target.value)}
                className="h-10 w-full rounded-xl border border-slate-300 bg-white px-3 text-xs"
              >
                <option value="">Pilih bank</option>
                {BANK_OPTIONS.map((bank) => (
                  <option key={bank.id} value={bank.label}>
                    {bank.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-1.5">
              <span className="text-xs font-bold text-slate-700">Nomor Rekening</span>
              <Input
                inputMode="numeric"
                value={draft.bank?.number ?? ""}
                onChange={(event) => setBank("number", event.target.value.replace(/\D/g, ""))}
                className="h-10 rounded-xl text-xs"
              />
            </label>
            <label className="space-y-1.5">
              <span className="text-xs font-bold text-slate-700">Atas Nama</span>
              <Input
                value={draft.bank?.holder ?? ""}
                onChange={(event) => setBank("holder", event.target.value)}
                className="h-10 rounded-xl text-xs"
              />
            </label>
            {draft.bank?.holder?.trim() !== draft.name?.trim() && (
              <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-[11px] text-amber-800 sm:col-span-3">
                <Icon name="alert" className="mt-0.5 h-4 w-4 shrink-0" />
                Atas nama rekening berbeda dengan nama organisasi. Pastikan rekening ini milik organisasi Anda.
              </div>
            )}
          </div>
        )}

        <div className="mt-5">
          <p className="text-xs font-bold text-slate-700">Riwayat perubahan rekening</p>
          <div className="mt-2 divide-y divide-slate-100">
            {(draft.bankHistory || []).map((entry) => (
              <div key={entry.id} className="flex justify-between gap-3 py-2 text-[11px]">
                <span className="text-slate-600">{entry.note}</span>
                <span className="text-slate-400">
                  {entry.actor} • {entry.date}
                </span>
              </div>
            ))}
          </div>
        </div>
      </SectionCard>

      <SectionCard
        id="dokumen"
        title="Dokumen Verifikasi"
        subtitle="Status, tanggal unggah, dan alasan penolakan dokumen."
        dirty={dirty.documents}
        onSave={() => commit(draft, "Dokumen disimpan.")}
        saveLabel="Simpan Dokumen"
      >
        <div className="space-y-3">
          {(draft.documents || []).map((doc) => (
            <div key={doc.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 p-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-bold text-slate-900">{doc.label}</p>
                  <Badge variant={docVariant(doc.status)}>{doc.status}</Badge>
                </div>
                <p className="mt-1 text-[11px] text-slate-400">Diunggah {doc.uploadedAt}</p>
                {doc.reason && <p className="mt-1 text-[11px] text-rose-600">Alasan: {doc.reason}</p>}
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" rounded="lg" onClick={() => viewDocument(doc)}>
                  Lihat
                </Button>
                <label className="cursor-pointer rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600 transition hover:bg-slate-200">
                  Ganti
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleDocumentFile(doc.id)}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          ))}
          {(draft.documents || []).length === 0 && (
            <p className="text-xs text-slate-400">Belum ada dokumen diunggah.</p>
          )}
          <Button variant="outline" size="sm" rounded="lg" onClick={addDocument}>
            + Tambah dokumen
          </Button>
        </div>
      </SectionCard>

      {otpOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-900">Verifikasi Ulang</h3>
                <p className="mt-1 text-xs text-slate-500">
                  Kode dikirim ke {draft.email}. Masukkan 6 digit kode tersebut.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOtpOpen(false)}
                aria-label="Tutup verifikasi"
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100"
              >
                <Icon name="close" className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-5 rounded-xl border border-dashed border-brand-200 bg-brand-50/60 p-3 text-center text-xs text-brand-800">
              Kode demo: <strong className="tracking-widest">{otpCode}</strong>
            </div>
            <Input
              inputMode="numeric"
              value={otp}
              onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="000000"
              className="mt-4 h-12 text-center text-lg tracking-[0.5em]"
              aria-label="Kode verifikasi"
            />
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="ghost" rounded="xl" onClick={() => setOtpOpen(false)}>
                Batal
              </Button>
              <Button variant="primary" rounded="xl" onClick={verifyOtp} disabled={otp.length !== 6}>
                Verifikasi
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
