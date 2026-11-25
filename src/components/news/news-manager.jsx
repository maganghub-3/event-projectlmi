"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useMemo, useRef, useState } from "react";
import Icon from "@/app/landing/Icon";
import Button from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import notify from "@/lib/sweetalert";
import { escapeHtml } from "@/lib/auth-utils";
import { COLLABORATION_STORIES } from "@/data/blog-stories";

const CATEGORIES = [
  { id: "musik", label: "Konser Musik" },
  { id: "festival", label: "Festival Kuliner" },
  { id: "olahraga", label: "Olahraga & Komunitas" },
  { id: "workshop", label: "Workshop & Summit" },
];

const STATUS_META = {
  published: {
    label: "Dipublikasikan",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  review: {
    label: "Menunggu Review",
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  draft: {
    label: "Draft",
    className: "bg-slate-100 text-slate-600 border-slate-200",
  },
};

const INITIAL_NEWS = [
  ...COLLABORATION_STORIES.map((story) => ({
    id: story.id,
    title: story.title,
    slug: story.slug,
    category: story.category,
    categoryLabel: story.categoryLabel,
    partner: story.partner,
    city: story.city,
    photo: story.photo || "",
    summary: story.summary,
    content: story.overview,
    readTime: story.readTime,
    status: "published",
    updatedAt: story.year,
  })),
  {
    id: "draft-contoh",
    title: "Kolaborasi Festival Seni Pantai Timur 2026",
    slug: "festival-seni-pantai-timur-2026",
    category: "workshop",
    categoryLabel: "Workshop & Summit",
    partner: "Komunitas Seni Pantai Timur",
    city: "Malang",
    photo: "",
    summary: "Draf awal liputan kolaborasi festival seni yang rencananya digelar awal tahun depan.",
    content: "Liputan masih disusun bersama tim EO.",
    readTime: "3 menit baca",
    status: "draft",
    updatedAt: "2 jam lalu",
  },
  {
    id: "review-contoh",
    title: "Lari Bareng Komunitas: Jakarta Night Run 10K",
    slug: "jakarta-night-run-10k",
    category: "olahraga",
    categoryLabel: "Olahraga & Komunitas",
    partner: "Jakarta Runners Club",
    city: "Jakarta",
    photo: "",
    summary: "Berita dari EO yang menunggu tinjauan super admin sebelum tayang di halaman publik.",
    content: "Cerita tentang persiapan dan pelaksanaan lari malam bersama komunitas.",
    readTime: "3 menit baca",
    status: "review",
    updatedAt: "1 hari lalu",
  },
];

const EMPTY_FORM = {
  title: "",
  slug: "",
  category: "musik",
  categoryLabel: "Konser Musik",
  partner: "",
  city: "",
  photo: "",
  summary: "",
  content: "",
  readTime: "3 menit baca",
  status: "draft",
};

const fieldClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20 placeholder:text-slate-400";

function slugify(text = "") {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function Field({ label, hint, className = "", children }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-xs font-bold text-slate-700">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[11px] leading-snug text-slate-400">{hint}</span>}
    </label>
  );
}

/**
 * Teks yang terpotong di layar kecil akan bergeser ke kiri secara perlahan
 * sehingga isinya tetap bisa dibaca. Di desktop tetap tampil dengan ellipsis.
 */
function ScrollText({ as: Tag = "div", children, className = "" }) {
  const containerRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) return undefined;

    const update = () => {
      const distance = Math.max(0, content.offsetWidth - container.clientWidth);
      const active = distance > 4;
      container.classList.toggle("marquee-active", active);
      container.style.setProperty("--marquee-distance", `-${distance}px`);
      container.style.setProperty(
        "--marquee-duration",
        `${Math.min(9, Math.max(4, Math.round(distance / 24)))}s`
      );
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [children]);

  return (
    <Tag ref={containerRef} className={`overflow-hidden ${className}`}>
      <span ref={contentRef} className="marquee-content whitespace-nowrap">
        {children}
      </span>
    </Tag>
  );
}

export default function NewsManager({ role = "super_admin" }) {
  const isAdmin = role === "super_admin";

  const [items, setItems] = useState(INITIAL_NEWS);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const counts = useMemo(
    () => ({
      published: items.filter((item) => item.status === "published").length,
      review: items.filter((item) => item.status === "review").length,
      draft: items.filter((item) => item.status === "draft").length,
    }),
    [items]
  );

  const visibleItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    return items.filter((item) => {
      const matchFilter = filter === "all" || item.status === filter;
      const matchSearch =
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.partner?.toLowerCase().includes(query) ||
        item.slug.toLowerCase().includes(query);
      return matchFilter && matchSearch;
    });
  }, [items, filter, search]);

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...EMPTY_FORM });
    setFormOpen(true);
  };

  const openEdit = (item) => {
    setEditingId(item.id);
    setForm({
      title: item.title,
      slug: item.slug,
      category: item.category,
      categoryLabel: item.categoryLabel,
      partner: item.partner || "",
      city: item.city || "",
      photo: item.photo || "",
      summary: item.summary || "",
      content: item.content || "",
      readTime: item.readTime || "3 menit baca",
      status: item.status,
    });
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditingId(null);
  };

  const handlePhotoFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      notify.toast("File harus berupa gambar (JPG, PNG, atau WebP).");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setField("photo", String(reader.result));
    reader.readAsDataURL(file);
  };

  const handleSubmit = (nextStatus) => {
    const title = form.title.trim();
    if (!title) {
      notify.toast("Judul berita wajib diisi.");
      return;
    }

    const payload = {
      ...form,
      title,
      slug: form.slug.trim() || slugify(title),
      categoryLabel:
        CATEGORIES.find((category) => category.id === form.category)?.label || form.categoryLabel,
      status: nextStatus,
      updatedAt: "Baru saja",
    };

    setItems((prev) =>
      editingId
        ? prev.map((item) => (item.id === editingId ? { ...payload, id: editingId } : item))
        : [{ ...payload, id: `berita-${Date.now()}` }, ...prev]
    );
    closeForm();

    notify.toast(
      isAdmin
        ? `Berita "${title}" berhasil disimpan (pratinjau UI).`
        : `Berita "${title}" dikirim untuk review (pratinjau UI).`
    );
  };

  const handleDelete = async (item) => {
    const confirmed = await notify.confirm({
      title: "Hapus berita ini?",
      text: `"${item.title}" akan dihapus dari daftar. Tindakan ini hanya simulasi pada tampilan.`,
      confirmText: "Ya, Hapus",
      cancelText: "Batal",
      danger: true,
    });
    if (confirmed) {
      setItems((prev) => prev.filter((entry) => entry.id !== item.id));
      notify.toast("Berita dihapus dari daftar (pratinjau UI).");
    }
  };

  const handlePreview = (item) => {
    const status = STATUS_META[item.status]?.label || item.status;
    notify.alert({
      title: escapeHtml(item.title),
      html: `
        <div style="text-align:left;font-size:13px;line-height:1.7;color:#475569">
          <p style="margin-bottom:10px">${escapeHtml(item.summary || "Belum ada ringkasan.")}</p>
          <hr style="border:0;border-top:1px solid #e2e8f0;margin:10px 0" />
          <p><strong>Kategori:</strong> ${escapeHtml(item.categoryLabel)}</p>
          <p><strong>Mitra:</strong> ${escapeHtml(item.partner || "-")} • <strong>Kota:</strong> ${escapeHtml(item.city || "-")}</p>
          <p><strong>Status:</strong> ${escapeHtml(status)}</p>
          <p style="margin-top:10px;color:#94a3b8">Pratinjau singkat. Halaman publik: /blog/${escapeHtml(item.slug)}</p>
        </div>
      `,
      icon: "info",
    });
  };

  const handleStatusChange = (item, status) => {
    setItems((prev) =>
      prev.map((entry) =>
        entry.id === item.id ? { ...entry, status, updatedAt: "Baru saja" } : entry
      )
    );
    notify.toast(
      status === "published"
        ? "Berita disetujui dan dipublikasikan (pratinjau UI)."
        : "Berita dikembalikan ke draft (pratinjau UI)."
    );
  };

  const statCards = [
    {
      label: "Total Berita",
      value: items.length,
      icon: "news",
      tone: "bg-brand-50 text-brand-700",
    },
    {
      label: "Dipublikasikan",
      value: counts.published,
      icon: "checkBadge",
      tone: "bg-emerald-50 text-emerald-700",
    },
    {
      label: "Menunggu Review",
      value: counts.review,
      icon: "clock",
      tone: "bg-amber-50 text-amber-700",
    },
    {
      label: "Draft",
      value: counts.draft,
      icon: "eyeOff",
      tone: "bg-slate-100 text-slate-600",
    },
  ];

  const filters = [
    { id: "all", label: "Semua" },
    { id: "published", label: "Dipublikasikan" },
    { id: "review", label: "Menunggu Review" },
    { id: "draft", label: "Draft" },
  ];

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-brand-700 ring-1 ring-brand-200">
            <Icon name="news" className="h-3.5 w-3.5" />
            Kelola Konten
          </span>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            Berita &amp; Kilas Event
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {isAdmin
              ? "Tulis, tinjau, dan publikasikan cerita kemitraan yang tampil di halaman utama."
              : "Tulis cerita event Anda dan kirimkan untuk ditinjau oleh super admin."}
          </p>
        </div>
        <Button variant="primary" onClick={openCreate} className="shrink-0">
          <span className="text-base leading-none">+</span> Tulis Berita
        </Button>
      </div>

      {/* INFO SIMULASI */}
      <div className="flex items-start gap-3 rounded-2xl border border-brand-200/80 bg-brand-50/70 p-4 text-xs leading-relaxed text-brand-900">
        <Icon name="sparkles" className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
        <p>
          <strong>Tampilan awal (belum terhubung backend).</strong> Semua perubahan di halaman ini
          hanya simulasi di browser. Foto diunggah dari perangkat untuk pratinjau; saat backend
          siap, foto akan disimpan di <code className="rounded bg-white/70 px-1">public/images/blog/</code>{" "}
          atau object storage.
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-[11px] font-bold text-slate-500">{stat.label}</p>
              <span className={`rounded-lg p-1.5 ${stat.tone}`}>
                <Icon name={stat.icon} className="h-4 w-4" />
              </span>
            </div>
            <p className="mt-2 text-2xl font-black text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* TOOLBAR */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {filters.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
                filter === tab.id
                  ? "bg-brand-600 text-white shadow-md shadow-brand-600/20"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-64">
          <Icon
            name="search"
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Cari judul atau mitra…"
            className="h-10 pl-9 text-xs"
            aria-label="Cari berita"
          />
        </div>
      </div>

      {/* LIST */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {visibleItems.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-6 py-16 text-center">
            <Icon name="news" className="h-9 w-9 text-slate-400" />
            <p className="text-sm font-bold text-slate-800">Belum ada berita</p>
            <p className="text-xs text-slate-500">Coba ubah filter atau tulis berita baru.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {visibleItems.map((item) => {
              const status = STATUS_META[item.status] || STATUS_META.draft;
              return (
                <div
                  key={item.id}
                  className="flex flex-col gap-4 p-4 transition hover:bg-slate-50/70 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 items-start gap-3.5">
                    <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                      {item.photo ? (
                        <img src={item.photo} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-2xl">
                          <Icon name="news" className="h-7 w-7 text-slate-400" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge
                          variant="secondary"
                          className="border-brand-100 bg-brand-50 text-[10px] text-brand-700"
                        >
                          {item.categoryLabel}
                        </Badge>
                        <span
                          className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${status.className}`}
                        >
                          {status.label}
                        </span>
                      </div>
                      <ScrollText as="h3" className="mt-1.5 text-sm font-extrabold text-slate-900">
                        {item.title}
                      </ScrollText>
                      <ScrollText as="p" className="mt-0.5 text-[11px] text-slate-500">
                        /{item.slug} • {item.partner || "-"} • {item.updatedAt}
                      </ScrollText>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-1.5 self-end sm:self-auto">
                    {isAdmin && item.status === "review" && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleStatusChange(item, "published")}
                          title="Setujui & publikasikan"
                          aria-label="Setujui berita"
                          className="rounded-lg bg-emerald-50 p-2 text-emerald-700 transition hover:bg-emerald-100"
                        >
                          <Icon name="check" className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStatusChange(item, "draft")}
                          title="Kembalikan ke draft"
                          aria-label="Kembalikan ke draft"
                          className="rounded-lg bg-slate-100 p-2 text-slate-600 transition hover:bg-slate-200"
                        >
                          <Icon name="xMark" className="h-4 w-4" />
                        </button>
                      </>
                    )}
                    <button
                      type="button"
                      onClick={() => handlePreview(item)}
                      title="Pratinjau"
                      aria-label="Pratinjau berita"
                      className="rounded-lg bg-slate-100 p-2 text-slate-600 transition hover:bg-slate-200 hover:text-slate-900"
                    >
                      <Icon name="eye" className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => openEdit(item)}
                      title="Ubah berita"
                      aria-label="Ubah berita"
                      className="rounded-lg bg-slate-100 p-2 text-slate-600 transition hover:bg-slate-200 hover:text-slate-900"
                    >
                      <Icon name="edit" className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item)}
                      title="Hapus berita"
                      aria-label="Hapus berita"
                      className="rounded-lg bg-rose-50 p-2 text-rose-600 transition hover:bg-rose-100"
                    >
                      <Icon name="trash" className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* FORM MODAL */}
      {formOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-slate-950/60 p-3 backdrop-blur-sm sm:p-6">
          <div className="my-4 w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl sm:my-8">
            {/* Modal header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4 sm:px-7">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  {editingId ? "Ubah Berita" : "Tulis Berita Baru"}
                </h3>
                <p className="mt-0.5 text-xs text-slate-500">
                  Lengkapi detail cerita kemitraan sebelum disimpan.
                </p>
              </div>
              <button
                type="button"
                onClick={closeForm}
                className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label="Tutup formulir"
              >
                <Icon name="close" className="h-5 w-5" />
              </button>
            </div>

            {/* Modal body */}
            <div className="space-y-5 px-5 py-5 sm:px-7">
              <div className="grid gap-5 lg:grid-cols-[240px_1fr]">
                <Field
                  label="Foto Berita"
                  hint="JPG/PNG/WebP. Pratinjau dari perangkat hanya untuk demo UI."
                >
                  <label className="group relative flex h-44 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 text-center transition hover:border-brand-400 hover:bg-brand-50/40">
                    {form.photo ? (
                      <img
                        src={form.photo}
                        alt="Pratinjau foto berita"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <>
                        <Icon name="camera" className="h-8 w-8 text-slate-400" />
                        <span className="mt-2 text-xs font-bold text-slate-600">
                          Klik untuk pilih foto
                        </span>
                        <span className="mt-0.5 text-[11px] text-slate-400">atau tarik file ke sini</span>
                      </>
                    )}
                    {form.photo && (
                      <span className="absolute bottom-2 rounded-full bg-slate-900/70 px-2.5 py-1 text-[10px] font-bold text-white">
                        Ganti foto
                      </span>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoFile}
                      className="hidden"
                      aria-label="Pilih foto berita"
                    />
                  </label>
                </Field>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Judul Berita" className="sm:col-span-2">
                    <Input
                      value={form.title}
                      onChange={(event) => {
                        setField("title", event.target.value);
                        if (!editingId) setField("slug", slugify(event.target.value));
                      }}
                      placeholder="Contoh: Sukses Festival Jazz Surabaya 2025"
                      className={fieldClass}
                    />
                  </Field>

                  <Field label="Slug URL" hint="Otomatis dari judul, bisa diubah manual.">
                    <Input
                      value={form.slug}
                      onChange={(event) => setField("slug", slugify(event.target.value))}
                      placeholder="festival-jazz-surabaya-2025"
                      className={fieldClass}
                    />
                  </Field>

                  <Field label="Kategori">
                    <select
                      value={form.category}
                      onChange={(event) => {
                        const category = CATEGORIES.find((item) => item.id === event.target.value);
                        setField("category", event.target.value);
                        setField("categoryLabel", category?.label || "");
                      }}
                      className={fieldClass}
                    >
                      {CATEGORIES.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Mitra / Penyelenggara">
                    <Input
                      value={form.partner}
                      onChange={(event) => setField("partner", event.target.value)}
                      placeholder="Nama EO atau mitra"
                      className={fieldClass}
                    />
                  </Field>

                  <Field label="Kota">
                    <Input
                      value={form.city}
                      onChange={(event) => setField("city", event.target.value)}
                      placeholder="Contoh: Surabaya"
                      className={fieldClass}
                    />
                  </Field>

                  <Field label="Waktu Baca">
                    <Input
                      value={form.readTime}
                      onChange={(event) => setField("readTime", event.target.value)}
                      placeholder="4 menit baca"
                      className={fieldClass}
                    />
                  </Field>

                  <Field label="Status">
                    <select
                      value={form.status}
                      onChange={(event) => setField("status", event.target.value)}
                      className={fieldClass}
                    >
                      <option value="draft">Draft</option>
                      <option value="review">Menunggu Review</option>
                      {isAdmin && <option value="published">Dipublikasikan</option>}
                    </select>
                  </Field>

                  <Field label="Ringkasan" className="sm:col-span-2">
                    <textarea
                      value={form.summary}
                      onChange={(event) => setField("summary", event.target.value)}
                      rows={3}
                      placeholder="Ringkasan singkat yang tampil di kartu berita…"
                      className={`${fieldClass} resize-none`}
                    />
                  </Field>

                  <Field label="Isi Cerita" className="sm:col-span-2">
                    <textarea
                      value={form.content}
                      onChange={(event) => setField("content", event.target.value)}
                      rows={5}
                      placeholder="Tulis cerita lengkap kemitraan di sini…"
                      className={`${fieldClass} resize-y`}
                    />
                  </Field>
                </div>
              </div>
            </div>

            {/* Modal footer */}
            <div className="flex flex-wrap items-center justify-end gap-2 border-t border-slate-200 bg-slate-50/80 px-5 py-4 sm:px-7">
              <Button variant="ghost" onClick={closeForm}>
                Batal
              </Button>
              <Button variant="outline" onClick={() => handleSubmit("draft")}>
                Simpan Draft
              </Button>
              <Button
                variant="primary"
                onClick={() => handleSubmit(isAdmin ? "published" : "review")}
              >
                {isAdmin ? "Publikasikan" : "Kirim untuk Review"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
