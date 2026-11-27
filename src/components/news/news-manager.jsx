"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import Icon from "@/app/landing/Icon";
import Button from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import notify from "@/lib/sweetalert";
import { escapeHtml } from "@/lib/auth-utils";
import {
  STATUS_META,
  deleteNewsItem,
  getNewsSnapshot,
  getServerNewsSnapshot,
  subscribeNews,
  updateNewsStatus,
} from "@/data/news-store";

/**
 * Teks yang terpotong di layar kecil bergeser ke kiri perlahan supaya tetap
 * terbaca. Di desktop tetap tampil dengan ellipsis.
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

export default function NewsManager({
  role = "super_admin",
  basePath = "/dashboard-admin/berita",
}) {
  const isAdmin = role === "super_admin";
  const items = useSyncExternalStore(
    subscribeNews,
    getNewsSnapshot,
    getServerNewsSnapshot
  );
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

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

  const handleDelete = async (item) => {
    const confirmed = await notify.confirm({
      title: "Hapus berita ini?",
      text: `"${item.title}" akan dihapus dari daftar. Tindakan ini hanya simulasi pada tampilan.`,
      confirmText: "Ya, Hapus",
      cancelText: "Batal",
      danger: true,
    });
    if (confirmed) {
      deleteNewsItem(item.id);
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
    updateNewsStatus(item.id, status);
    notify.toast(
      status === "published"
        ? "Berita disetujui dan dipublikasikan (pratinjau UI)."
        : "Berita dikembalikan ke draft (pratinjau UI)."
    );
  };

  const statCards = [
    { label: "Total Berita", value: items.length, icon: "news", tone: "bg-brand-50 text-brand-700" },
    { label: "Dipublikasikan", value: counts.published, icon: "checkBadge", tone: "bg-emerald-50 text-emerald-700" },
    { label: "Menunggu Review", value: counts.review, icon: "clock", tone: "bg-amber-50 text-amber-700" },
    { label: "Draft", value: counts.draft, icon: "eyeOff", tone: "bg-slate-100 text-slate-600" },
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
        <Button variant="primary" href={`${basePath}/tulis`} className="shrink-0">
          <span className="text-base leading-none">+</span> Tulis Berita
        </Button>
      </div>

      {/* INFO SIMULASI */}
      <div className="flex items-start gap-3 rounded-2xl border border-brand-200/80 bg-brand-50/70 p-4 text-xs leading-relaxed text-brand-900">
        <Icon name="sparkles" className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
        <p>
          <strong>Tampilan awal (belum terhubung backend).</strong> Semua perubahan di halaman ini
          hanya simulasi di browser dan tersimpan di perangkat ini. Saat backend siap, berita dan
          foto akan disimpan di server / object storage.
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
                        {(item.tags || []).length > 0 && (
                          <span className="text-[10px] text-slate-400">
                            #{item.tags.slice(0, 2).join(" #")}
                          </span>
                        )}
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
                    <Button
                      variant="ghost"
                      size="icon"
                      rounded="lg"
                      href={`${basePath}/tulis?edit=${encodeURIComponent(item.id)}`}
                      title="Ubah berita"
                      aria-label="Ubah berita"
                      className="text-slate-600 hover:text-slate-900"
                    >
                      <Icon name="edit" className="h-4 w-4" />
                    </Button>
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
    </div>
  );
}
