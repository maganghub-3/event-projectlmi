// Sumber data berita bersama (mock, disimpan di localStorage browser).
// Dipakai both daftar berita dan halaman editor agar sinkron tanpa backend.

import { COLLABORATION_STORIES } from "./blog-stories";

export const CATEGORIES = [
  { id: "musik", label: "Konser Musik" },
  { id: "festival", label: "Festival Kuliner" },
  { id: "olahraga", label: "Olahraga & Komunitas" },
  { id: "workshop", label: "Workshop & Summit" },
];

export const STATUS_META = {
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
    photoCaption: "",
    photoAlt: story.title,
    summary: story.summary,
    content: story.overview,
    tags: [],
    metaDescription: story.summary,
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
    photoCaption: "",
    photoAlt: "",
    summary: "Draf awal liputan kolaborasi festival seni yang rencananya digelar awal tahun depan.",
    content: "Liputan masih disusun bersama tim EO.",
    tags: [],
    metaDescription: "",
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
    photoCaption: "",
    photoAlt: "",
    summary: "Berita dari EO yang menunggu tinjauan super admin sebelum tayang di halaman publik.",
    content: "Cerita tentang persiapan dan pelaksanaan lari malam bersama komunitas.",
    tags: [],
    metaDescription: "",
    readTime: "3 menit baca",
    status: "review",
    updatedAt: "1 hari lalu",
  },
];

const STORAGE_KEY = "lmi_news_items";

let cachedRaw;
let cachedItems = INITIAL_NEWS;
const listeners = new Set();

function readRaw() {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function parse(raw) {
  if (!raw) return INITIAL_NEWS;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_NEWS;
  } catch {
    return INITIAL_NEWS;
  }
}

export function getNewsSnapshot() {
  const raw = readRaw();
  if (raw === cachedRaw) return cachedItems;
  cachedRaw = raw;
  cachedItems = parse(raw);
  return cachedItems;
}

export function getServerNewsSnapshot() {
  return INITIAL_NEWS;
}

export function subscribeNews(onChange) {
  listeners.add(onChange);
  if (typeof window === "undefined") return () => listeners.delete(onChange);

  const handleStorage = (event) => {
    if (event.key === STORAGE_KEY) onChange();
  };
  window.addEventListener("storage", handleStorage);

  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", handleStorage);
  };
}

function persist(next) {
  cachedItems = next;
  cachedRaw = typeof window === "undefined" ? null : JSON.stringify(next);
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, cachedRaw);
    } catch {
      // abaikan
    }
  }
  listeners.forEach((listener) => listener());
}

export function getNewsById(id) {
  return getNewsSnapshot().find((item) => item.id === id) ?? null;
}

export function saveNewsItem(payload, editingId = null) {
  const current = getNewsSnapshot();
  const next = editingId
    ? current.map((item) => (item.id === editingId ? { ...payload, id: editingId } : item))
    : [{ ...payload, id: `berita-${Date.now()}` }, ...current];
  persist(next);
  return next;
}

export function deleteNewsItem(id) {
  persist(getNewsSnapshot().filter((item) => item.id !== id));
}

export function updateNewsStatus(id, status) {
  persist(
    getNewsSnapshot().map((item) =>
      item.id === id ? { ...item, status, updatedAt: "Baru saja" } : item
    )
  );
}
