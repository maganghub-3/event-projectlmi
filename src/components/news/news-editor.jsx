"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Icon from "@/app/landing/Icon";
import Button from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import notify from "@/lib/sweetalert";
import {
  CATEGORIES,
  getNewsById,
  saveNewsItem,
} from "@/data/news-store";

const EMPTY_FORM = {
  title: "",
  slug: "",
  category: "musik",
  categoryLabel: "Konser Musik",
  partner: "",
  city: "",
  photo: "",
  photoCaption: "",
  photoAlt: "",
  summary: "",
  content: "",
  tags: "",
  metaDescription: "",
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

function Field({ label, hint, children, className = "" }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-xs font-bold text-slate-700">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[11px] leading-snug text-slate-400">{hint}</span>}
    </label>
  );
}

export default function NewsEditor({ role, basePath }) {
  const isAdmin = role === "super_admin";
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const existing = editId ? getNewsById(editId) : null;

  const [form, setForm] = useState(() => {
    if (!existing) return { ...EMPTY_FORM };
    return {
      title: existing.title || "",
      slug: existing.slug || "",
      category: existing.category || "musik",
      categoryLabel: existing.categoryLabel || "Konser Musik",
      partner: existing.partner || "",
      city: existing.city || "",
      photo: existing.photo || "",
      photoCaption: existing.photoCaption || "",
      photoAlt: existing.photoAlt || existing.title || "",
      summary: existing.summary || "",
      content: existing.content || "",
      tags: (existing.tags || []).join(", "),
      metaDescription: existing.metaDescription || "",
      readTime: existing.readTime || "3 menit baca",
      status: existing.status || "draft",
    };
  });

  const [previewMode, setPreviewMode] = useState(false);
  const [savedAt, setSavedAt] = useState(null);
  const editorRef = useRef(null);

  const setField = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  useEffect(() => {
    if (!editorRef.current) return;
    const next = form.content || "";
    if (editorRef.current.innerHTML !== next) {
      editorRef.current.innerHTML = next;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      try {
        localStorage.setItem("lmi_news_draft", JSON.stringify(form));
        setSavedAt(
          new Date().toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
          })
        );
      } catch {
        // abaikan
      }
    }, 4000);

    return () => clearInterval(timer);
  }, [form]);

  const editorText = form.content
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .trim();
  const wordCount = editorText
    ? editorText.split(/\s+/).filter(Boolean).length
    : 0;

  const handleEditorInput = () =>
    setField("content", editorRef.current?.innerHTML ?? "");

  const execFormat = (command, value = null) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    document.execCommand(command, false, value);
    setField("content", editorRef.current.innerHTML);
  };

  const handleLink = () => {
    const url = window.prompt("Masukkan URL tautan:", "https://");
    if (url && url.trim()) execFormat("createLink", url.trim());
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

    const tags = form.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    saveNewsItem(
      {
        ...form,
        title,
        slug: form.slug.trim() || slugify(title),
        categoryLabel:
          CATEGORIES.find((category) => category.id === form.category)?.label ||
          form.categoryLabel,
        tags,
        readTime: `${Math.max(1, Math.ceil(wordCount / 200))} menit baca`,
        status: nextStatus,
        updatedAt: "Baru saja",
      },
      existing?.id ?? null
    );

    notify.toast(
      nextStatus === "published"
        ? "Berita berhasil dipublikasikan."
        : nextStatus === "review"
          ? "Berita dikirim untuk review."
          : "Berita disimpan sebagai draft."
    );
    router.push(basePath);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Button variant="link" size="sm" rounded="lg" href={basePath}>
            ← Kembali ke daftar berita
          </Button>
          <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-900">
            {existing ? "Ubah Berita" : "Tulis Berita Baru"}
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            {savedAt
              ? `Draft tersimpan otomatis pukul ${savedAt}`
              : "Draft akan tersimpan otomatis setiap beberapa detik"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={previewMode ? "primary" : "outline"}
            size="sm"
            rounded="lg"
            onClick={() => setPreviewMode((prev) => !prev)}
            leftIcon={<Icon name={previewMode ? "edit" : "eye"} className="h-4 w-4" />}
          >
            {previewMode ? "Kembali Menulis" : "Pratinjau"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_300px]">
        {/* Kolom tulis */}
        <section className="rounded-3xl border border-slate-200/90 bg-white p-5 shadow-sm sm:p-8">
          {previewMode ? (
            <article className="mx-auto max-w-2xl">
              <p className="text-[11px] font-bold uppercase tracking-wider text-brand-700">
                {form.categoryLabel}
              </p>
              <h1 className="mt-2 text-3xl font-black leading-tight text-slate-900 sm:text-4xl">
                {form.title || "Judul berita"}
              </h1>
              <p className="mt-3 text-base text-slate-500">
                {form.summary || "Belum ada ringkasan."}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                <span>{form.partner || "Penulis"}</span>
                <span>•</span>
                <span>{form.city || "-"}</span>
                <span>•</span>
                <span>{Math.max(1, Math.ceil(wordCount / 200))} menit baca</span>
              </div>
              {form.photo && (
                <img
                  src={form.photo}
                  alt={form.photoAlt || form.title}
                  className="mt-6 h-64 w-full rounded-2xl object-cover"
                />
              )}
              {form.photoCaption && (
                <p className="mt-2 text-center text-[11px] italic text-slate-400">
                  {form.photoCaption}
                </p>
              )}
              <div
                className="mt-6 space-y-3 text-sm leading-7 text-slate-700 [&_a]:text-brand-600 [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-brand-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-slate-500 [&_h2]:mt-6 [&_h2]:text-xl [&_h2]:font-black [&_h2]:text-slate-900 [&_h3]:mt-5 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-slate-900 [&_li]:ml-5 [&_li]:list-disc [&_ol_li]:list-decimal [&_p]:mb-3"
                dangerouslySetInnerHTML={{
                  __html: form.content || "<p>Belum ada isi cerita.</p>",
                }}
              />
            </article>
          ) : (
            <div className="mx-auto max-w-2xl">
              <label className="group relative flex h-40 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 text-center transition hover:border-brand-400 hover:bg-brand-50/40 sm:h-52">
                {form.photo ? (
                  <img
                    src={form.photo}
                    alt="Pratinjau sampul"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <>
                    <Icon name="camera" className="h-8 w-8 text-slate-400" />
                    <span className="mt-2 text-xs font-bold text-slate-600">
                      Tambahkan sampul berita
                    </span>
                    <span className="mt-0.5 text-[11px] text-slate-400">
                      Klik untuk pilih gambar
                    </span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoFile}
                  className="hidden"
                  aria-label="Pilih sampul berita"
                />
              </label>

              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <Field label="Caption Foto">
                  <Input
                    value={form.photoCaption}
                    onChange={(event) => setField("photoCaption", event.target.value)}
                    placeholder="Keterangan singkat di bawah foto"
                    className={fieldClass}
                  />
                </Field>
                <Field label="Alt Teks Foto">
                  <Input
                    value={form.photoAlt}
                    onChange={(event) => setField("photoAlt", event.target.value)}
                    placeholder="Deskripsi gambar untuk aksesibilitas"
                    className={fieldClass}
                  />
                </Field>
              </div>

              <input
                value={form.title}
                onChange={(event) => {
                  setField("title", event.target.value);
                  if (!existing) setField("slug", slugify(event.target.value));
                }}
                placeholder="Judul berita..."
                aria-label="Judul berita"
                className="mt-8 w-full border-0 bg-transparent text-3xl font-black leading-tight text-slate-900 outline-none placeholder:text-slate-300 sm:text-4xl"
              />
              <textarea
                value={form.summary}
                onChange={(event) => setField("summary", event.target.value)}
                rows={2}
                placeholder="Tulis ringkasan singkat yang tampil di kartu berita..."
                aria-label="Ringkasan berita"
                className="mt-3 w-full resize-none border-0 bg-transparent text-base leading-relaxed text-slate-500 outline-none placeholder:text-slate-300"
              />

              <div className="sticky top-0 z-10 mt-4 flex flex-wrap items-center gap-1 border-y border-slate-200 bg-white/95 py-2 backdrop-blur">
                {[
                  { label: "B", title: "Tebal", command: "bold", className: "font-black" },
                  { label: "I", title: "Miring", command: "italic", className: "italic" },
                  { label: "H2", title: "Judul bagian", command: "formatBlock", value: "h2" },
                  { label: "H3", title: "Subjudul", command: "formatBlock", value: "h3" },
                  { label: "❝", title: "Kutipan", command: "formatBlock", value: "blockquote" },
                  { label: "• Daftar", title: "Daftar poin", command: "insertUnorderedList" },
                  { label: "1. Daftar", title: "Daftar bernomor", command: "insertOrderedList" },
                  { label: "↩", title: "Hapus format", command: "removeFormat" },
                ].map((tool) => (
                  <button
                    key={tool.label}
                    type="button"
                    title={tool.title}
                    onClick={() => execFormat(tool.command, tool.value)}
                    className={`rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-600 transition hover:bg-brand-50 hover:text-brand-700 ${tool.className || ""}`}
                  >
                    {tool.label}
                  </button>
                ))}
                <button
                  type="button"
                  title="Sisipkan tautan"
                  onClick={handleLink}
                  className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-600 transition hover:bg-brand-50 hover:text-brand-700"
                >
                  <Icon name="link" className="h-3.5 w-3.5" /> Tautan
                </button>
              </div>

              <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                role="textbox"
                aria-multiline="true"
                aria-label="Isi berita"
                data-placeholder="Tulis cerita kemitraan atau kilas event di sini..."
                onInput={handleEditorInput}
                className="min-h-[320px] py-5 text-sm leading-7 text-slate-700 outline-none empty:before:text-slate-300 empty:before:content-[attr(data-placeholder)] [&_a]:text-brand-600 [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-brand-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-slate-500 [&_h2]:mt-5 [&_h2]:text-xl [&_h2]:font-black [&_h2]:text-slate-900 [&_h3]:mt-4 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-slate-900 [&_li]:ml-5 [&_li]:list-disc [&_ol_li]:list-decimal [&_p]:mb-3"
              />

              <p className="border-t border-slate-100 pt-3 text-[11px] text-slate-400">
                {wordCount} kata • {Math.max(1, Math.ceil(wordCount / 200))} menit baca
              </p>
            </div>
          )}
        </section>

        {/* Panel pengaturan */}
        <aside className="h-fit rounded-3xl border border-slate-200/90 bg-white p-5 shadow-sm">
          <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
            Pengaturan Berita
          </p>
          <div className="mt-4 space-y-4">
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

            <Field label="Slug URL" hint="Otomatis dari judul, bisa diubah manual.">
              <Input
                value={form.slug}
                onChange={(event) => setField("slug", slugify(event.target.value))}
                placeholder="festival-jazz-surabaya-2025"
                className={fieldClass}
              />
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

            <Field label="Tag" hint="Pisahkan dengan koma.">
              <Input
                value={form.tags}
                onChange={(event) => setField("tags", event.target.value)}
                placeholder="konser, komunitas, jazz"
                className={fieldClass}
              />
            </Field>

            <Field label="Meta Description" hint="Ringkasan untuk mesin pencari.">
              <textarea
                value={form.metaDescription}
                onChange={(event) => setField("metaDescription", event.target.value)}
                rows={3}
                placeholder="Deskripsi singkat untuk SEO..."
                className={`${fieldClass} resize-none`}
              />
            </Field>

            <div className="rounded-xl border border-brand-100 bg-brand-50/60 p-3 text-[11px] leading-relaxed text-brand-900">
              <strong>Tip redaksi:</strong> gunakan H2 untuk membagi cerita, kutipan untuk pernyataan penting, dan sisipkan tautan ke acara terkait.
            </div>

            <div className="space-y-2 border-t border-slate-200 pt-4">
              <Button
                variant="outline"
                fullWidth
                rounded="xl"
                onClick={() => handleSubmit("draft")}
              >
                Simpan Draft
              </Button>
              <Button
                variant="primary"
                fullWidth
                rounded="xl"
                onClick={() => handleSubmit(isAdmin ? "published" : "review")}
              >
                {isAdmin ? "Publikasikan" : "Kirim untuk Review"}
              </Button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
