// Data contoh dashboard EO. Setiap akun EO (penyelenggara) memiliki event
// miliknya sendiri. Data ini disimpan di memori klien (belum pakai database).

export const EO_EVENTS = [
  {
    id: "evt-1",
    penyelenggaraId: "pen-1",
    title: "Jakarta Indie Music Vibes 2026",
    category: "Musik & Konser",
    date: "14 Des 2026",
    city: "Jakarta Selatan",
    venue: "Bengkel Space SCBD",
    address: "Bengkel Space, SCBD, Jakarta Selatan",
    price: 185000,
    sold: 840,
    quota: 1000,
    status: "aktif",
    balance: 18500000,
    poster:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80",
    description:
      "Festival musik indie tahunan yang menampilkan 12 band lokal, area kuliner, dan panggung akustik.",
    terms: [
      "Tiket resmi hanya dijual melalui LMI Event dan mitra resmi penyelenggara.",
      "Satu tiket berlaku untuk satu orang dan tidak dapat dipakai bergantian.",
      "Datang 30 menit sebelum jadwal mulai untuk pengambilan wristband.",
      "Penyelenggara berhak menolak masuk peserta yang melanggar ketentuan.",
    ],
    saleStart: "01 Nov 2026",
    saleEnd: "14 Des 2026",
    dailySales: [
      { date: "08 Des", sold: 96, revenue: 17760000 },
      { date: "09 Des", sold: 128, revenue: 23680000 },
      { date: "10 Des", sold: 154, revenue: 28490000 },
      { date: "11 Des", sold: 132, revenue: 24420000 },
      { date: "12 Des", sold: 176, revenue: 32560000 },
      { date: "13 Des", sold: 148, revenue: 27380000 },
      { date: "14 Des", sold: 106, revenue: 19610000 },
    ],
    ticketTypes: [
      {
        id: "tt-1-1",
        name: "Presale 1",
        price: 150000,
        quota: 300,
        sold: 300,
        saleStart: "01 Nov 2026",
        saleEnd: "20 Nov 2026",
      },
      {
        id: "tt-1-2",
        name: "Presale 2",
        price: 185000,
        quota: 500,
        sold: 420,
        saleStart: "21 Nov 2026",
        saleEnd: "10 Des 2026",
      },
      {
        id: "tt-1-3",
        name: "On The Spot",
        price: 225000,
        quota: 200,
        sold: 120,
        saleStart: "11 Des 2026",
        saleEnd: "14 Des 2026",
      },
    ],
  },
  {
    id: "evt-5",
    penyelenggaraId: "pen-2",
    title: "Yogyakarta Jazz Night 2027",
    category: "Musik & Konser",
    date: "05 Mar 2027",
    city: "Yogyakarta",
    venue: "Pendopo Agung Sleman",
    address: "Pendopo Agung, Sleman, Yogyakarta",
    price: 175000,
    sold: 360,
    quota: 600,
    status: "aktif",
    balance: 9800000,
    poster:
      "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=1200&q=80",
    description:
      "Malam jazz dengan orkestra lokal dan sesi kolaborasi musisi Jawa kontemporer.",
    terms: [
      "Tiket berlaku untuk satu orang dan tidak dapat dipindahtangankan.",
      "Anak di bawah usia 5 tahun tidak perlu tiket.",
    ],
    saleStart: "05 Jan 2027",
    saleEnd: "05 Mar 2027",
    dailySales: [
      { date: "01 Mar", sold: 48, revenue: 8400000 },
      { date: "02 Mar", sold: 72, revenue: 12600000 },
      { date: "03 Mar", sold: 96, revenue: 16800000 },
      { date: "04 Mar", sold: 80, revenue: 14000000 },
      { date: "05 Mar", sold: 64, revenue: 11200000 },
    ],
    ticketTypes: [
      {
        id: "tt-5-1",
        name: "Early Bird",
        price: 150000,
        quota: 200,
        sold: 200,
        saleStart: "05 Jan 2027",
        saleEnd: "31 Jan 2027",
      },
      {
        id: "tt-5-2",
        name: "Reguler",
        price: 175000,
        quota: 400,
        sold: 160,
        saleStart: "01 Feb 2027",
        saleEnd: "05 Mar 2027",
      },
    ],
  },
  {
    id: "evt-6",
    penyelenggaraId: "pen-2",
    title: "Bali Beach Cleanup & Music Fest",
    category: "Festival & Kuliner",
    date: "18 Apr 2027",
    city: "Bali",
    venue: "Pantai Seminyak",
    address: "Pantai Seminyak, Badung, Bali",
    price: 85000,
    sold: 210,
    quota: 400,
    status: "aktif",
    balance: 3400000,
    poster:
      "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1200&q=80",
    description:
      "Aksi bersih pantai pagi hari dilanjutkan festival musik dan pasar kuliner ramah lingkungan.",
    terms: [
      "Wajib membawa botol minum sendiri dan mengikuti sesi cleanup.",
      "Tiket tidak dapat didampingi oleh negara bagian yang tidak terdaftar.",
    ],
    saleStart: "01 Mar 2027",
    saleEnd: "18 Apr 2027",
    dailySales: [
      { date: "14 Apr", sold: 32, revenue: 2720000 },
      { date: "15 Apr", sold: 48, revenue: 4080000 },
      { date: "16 Apr", sold: 56, revenue: 4760000 },
      { date: "17 Apr", sold: 44, revenue: 3740000 },
      { date: "18 Apr", sold: 30, revenue: 2550000 },
    ],
    ticketTypes: [
      {
        id: "tt-6-1",
        name: "Reguler",
        price: 85000,
        quota: 300,
        sold: 180,
        saleStart: "01 Mar 2027",
        saleEnd: "18 Apr 2027",
      },
      {
        id: "tt-6-2",
        name: "VIP",
        price: 150000,
        quota: 100,
        sold: 30,
        saleStart: "01 Mar 2027",
        saleEnd: "18 Apr 2027",
      },
    ],
  },
];

export const EO_ATTENDEES = [
  {
    id: "ORD-8821",
    eventId: "evt-1",
    name: "Ananda Putri",
    email: "ananda.putri@gmail.com",
    qty: 2,
    total: 370000,
    payment: "QRIS GoPay",
    ticketType: "Presale 2",
    ticketStatus: "valid",
    orderDate: "08 Des 2026",
    checkedIn: true,
  },
  {
    id: "ORD-8819",
    eventId: "evt-1",
    name: "Siti Nurhaliza",
    email: "siti.n@gmail.com",
    qty: 1,
    total: 185000,
    payment: "ShopeePay",
    ticketType: "Presale 2",
    ticketStatus: "ditukar",
    orderDate: "09 Des 2026",
    checkedIn: false,
  },
  {
    id: "ORD-8817",
    eventId: "evt-1",
    name: "Dimas Saputra",
    email: "dimas.saputra@gmail.com",
    qty: 2,
    total: 370000,
    payment: "BCA Virtual Account",
    ticketType: "On The Spot",
    ticketStatus: "valid",
    orderDate: "11 Des 2026",
    checkedIn: false,
  },
  {
    id: "ORD-8816",
    eventId: "evt-1",
    name: "Clara Wijaya",
    email: "clara.wijaya@mail.com",
    qty: 1,
    total: 185000,
    payment: "QRIS GoPay",
    ticketType: "Presale 2",
    ticketStatus: "valid",
    orderDate: "12 Des 2026",
    checkedIn: true,
  },
  {
    id: "ORD-8815",
    eventId: "evt-1",
    name: "Bayu Anggara",
    email: "bayu.anggara@gmail.com",
    qty: 4,
    total: 740000,
    payment: "Kartu Kredit",
    ticketType: "Presale 1",
    ticketStatus: "ditukar",
    orderDate: "12 Des 2026",
    checkedIn: false,
  },
  {
    id: "ORD-8805",
    eventId: "evt-5",
    name: "Putri Ayu Lestari",
    email: "putri.ayu@gmail.com",
    qty: 2,
    total: 350000,
    payment: "QRIS GoPay",
    ticketType: "Early Bird",
    ticketStatus: "valid",
    orderDate: "02 Mar 2027",
    checkedIn: true,
  },
  {
    id: "ORD-8804",
    eventId: "evt-5",
    name: "Danang Prasetyo",
    email: "danang.prasetyo@mail.com",
    qty: 1,
    total: 175000,
    payment: "BCA Virtual Account",
    ticketType: "Reguler",
    ticketStatus: "valid",
    orderDate: "03 Mar 2027",
    checkedIn: false,
  },
  {
    id: "ORD-8803",
    eventId: "evt-6",
    name: "Wayan Sudarma",
    email: "wayan.sudarma@gmail.com",
    qty: 3,
    total: 255000,
    payment: "ShopeePay",
    ticketType: "Reguler",
    ticketStatus: "valid",
    orderDate: "15 Apr 2027",
    checkedIn: false,
  },
  {
    id: "ORD-8802",
    eventId: "evt-6",
    name: "Lina Kartika",
    email: "lina.kartika@mail.com",
    qty: 2,
    total: 170000,
    payment: "QRIS DANA",
    ticketType: "VIP",
    ticketStatus: "valid",
    orderDate: "16 Apr 2027",
    checkedIn: true,
  },
];

export function formatRupiah(value) {
  return `Rp ${Number(value || 0).toLocaleString("id-ID")}`;
}

export const STATUS_LABELS = {
  aktif: "Aktif",
  draft: "Draft",
  ditutup: "Ditutup",
  batal: "Dibatalkan",
  selesai: "Selesai",
};

export function getStatusLabel(status) {
  return STATUS_LABELS[status] ?? "Draft";
}

export function getStatusVariant(status) {
  if (status === "aktif") return "success";
  if (status === "draft" || status === "ditutup") return "warning";
  return "secondary";
}

// Sumber data event & peserta bersama (disimpan di memori klien).
let eventsStore = EO_EVENTS;
let attendeesStore = EO_ATTENDEES;
let nextEventId =
  Math.max(
    ...EO_EVENTS.map((event) => Number(event.id.replace("evt-", "")))
  ) + 1;

export function getEventsSnapshot(penyelenggaraId) {
  if (!penyelenggaraId) return [];
  return eventsStore.filter(
    (event) => event.penyelenggaraId === penyelenggaraId
  );
}

export function getAttendeesSnapshot() {
  return attendeesStore;
}

export function createEventId() {
  return `evt-${nextEventId++}`;
}

export function addEvent(event) {
  eventsStore = [event, ...eventsStore];
  return getEventsSnapshot(event.penyelenggaraId);
}

export function updateEvent(id, patch) {
  eventsStore = eventsStore.map((event) =>
    event.id === id ? { ...event, ...patch } : event
  );
  return getEventById(id);
}

export function deleteEventById(id) {
  eventsStore = eventsStore.filter((event) => event.id !== id);
}

export function getEventById(id) {
  return eventsStore.find((event) => event.id === id) ?? null;
}

export function isEventOwnedBy(id, penyelenggaraId) {
  const event = getEventById(id);
  return Boolean(event && event.penyelenggaraId === penyelenggaraId);
}

export function getAttendeesByEvent(eventId) {
  return attendeesStore.filter((row) => row.eventId === eventId);
}

export function setAttendeeCheckedIn(orderId, checkedIn) {
  attendeesStore = attendeesStore.map((row) =>
    row.id === orderId
      ? {
          ...row,
          checkedIn,
          ticketStatus: checkedIn ? "sudah masuk" : row.ticketStatus,
        }
      : row
  );
}

export function getEventStats(event) {
  const pct = Math.min(
    100,
    Math.round((event.sold / Math.max(event.quota, 1)) * 100)
  );

  return {
    revenue: event.sold * event.price,
    pct,
    remaining: Math.max(event.quota - event.sold, 0),
  };
}

// Simpan draft wizard ke browser agar tidak hilang saat berpindah langkah.
const DRAFT_KEY = "lmi_event_draft";

export function saveDraft(draft) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  } catch {
    // abaikan
  }
}

export function getDraft() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearDraft() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(DRAFT_KEY);
  } catch {
    // abaikan
  }
}

/* ---------------------- Data dashboard tingkat 1 ---------------------- */

export const EO_DASHBOARD_SALES = [
  { date: "08 Des", sold: 112, revenue: 20720000 },
  { date: "09 Des", sold: 146, revenue: 27010000 },
  { date: "10 Des", sold: 184, revenue: 34040000 },
  { date: "11 Des", sold: 158, revenue: 29230000 },
  { date: "12 Des", sold: 210, revenue: 38850000 },
  { date: "13 Des", sold: 176, revenue: 32560000 },
  { date: "14 Des", sold: 132, revenue: 24420000 },
];

export const EO_TASKS = [
  { id: "task-1", label: "Lengkapi rekening bank untuk pencairan", done: false },
  { id: "task-2", label: "Publikasikan acara yang masih berstatus draft", done: false },
  { id: "task-3", label: "Unggah dokumen verifikasi penyelenggara", done: true },
];

const ORDER_STATUS_OVERRIDES = {
  "ORD-8817": "MENUNGGU",
  "ORD-8804": "MENUNGGU",
  "ORD-8803": "DIBATALKAN",
};

export function getOrderStatus(row) {
  return ORDER_STATUS_OVERRIDES[row.id] ?? "DIBAYAR";
}

export const EO_FINANCE_SUMMARY = {
  held: 4250000,
  serviceFeePercent: 5,
  bank: {
    name: "BCA",
    number: "•••• 4821",
    holder: "Kolektif Nada Nusantara",
  },
};

export const EO_PAYOUT_HISTORY = [
  { id: "WD-2026-014", date: "10 Des 2026", amount: 12500000, status: "DICAIRKAN", event: "Jakarta Indie Music Vibes 2026" },
  { id: "WD-2026-013", date: "01 Des 2026", amount: 8200000, status: "DICAIRKAN", event: "Akustik Senja & Kopi Nusantara" },
  { id: "WD-2026-012", date: "18 Nov 2026", amount: 4500000, status: "MENUNGGU", event: "Workshop Manajemen Panggung" },
];

export const EO_DEMOGRAPHICS = {
  cities: [
    { label: "Jakarta", value: 42 },
    { label: "Bandung", value: 24 },
    { label: "Surabaya", value: 18 },
    { label: "Lainnya", value: 16 },
  ],
  ages: [
    { label: "18-24", value: 38 },
    { label: "25-34", value: 44 },
    { label: "35+", value: 18 },
  ],
  payments: [
    { label: "QRIS", value: 46 },
    { label: "Virtual Account", value: 32 },
    { label: "E-Wallet", value: 22 },
  ],
};

export const BANK_OPTIONS = [
  { id: "bca", label: "BCA", length: 10 },
  { id: "mandiri", label: "Mandiri", length: 12 },
  { id: "bni", label: "BNI", length: 10 },
  { id: "bri", label: "BRI", length: 11 },
  { id: "cimb", label: "CIMB Niaga", length: 12 },
  { id: "permata", label: "Permata", length: 10 },
];

export const DOCUMENT_STATUSES = [
  "Terverifikasi",
  "Menunggu verifikasi",
  "Ditolak",
  "Kedaluwarsa",
];

const DEFAULT_PROFILE = {
  "pen-1": {
    name: "Kolektif Nada Nusantara",
    picName: "Firmansyah Adi",
    description: "Komunitas penyelenggara konser dan festival musik indie di Indonesia.",
    logo: "/images/lmi-logo.png",
    logoData: "",
    email: "eo@lmi.id",
    phone: "0812-3456-7890",
    socials: { instagram: "@kolektifnada", tiktok: "@kolektifnada", website: "https://kolektifnada.id" },
    bank: { name: "BCA", number: "1234564821", holder: "Kolektif Nada Nusantara" },
    bankHistory: [
      { id: "BH-1", date: "01 Nov 2026", actor: "Super Admin", note: "Rekening awal didaftarkan" },
    ],
    verification: [
      { label: "Surat izin penyelenggara", status: "Terverifikasi" },
      { label: "NPWP organisasi", status: "Terverifikasi" },
    ],
    documents: [
      { id: "doc-1", label: "Surat izin penyelenggara", status: "Terverifikasi", uploadedAt: "12 Okt 2026", reason: "", url: "" },
      { id: "doc-2", label: "NPWP organisasi", status: "Terverifikasi", uploadedAt: "12 Okt 2026", reason: "", url: "" },
    ],
  },
  "pen-2": {
    name: "Java Sound Collective",
    picName: "Rangga Wicaksana",
    description: "Kolektif musisi dan penyelenggara event jazz lintas kota.",
    logo: "/images/lmi-logo.png",
    logoData: "",
    email: "java@lmi.id",
    phone: "0813-9876-5432",
    socials: { instagram: "@javasound", tiktok: "@javasound", website: "https://javasound.id" },
    bank: { name: "Mandiri", number: "9876543210", holder: "Java Sound Collective" },
    bankHistory: [
      { id: "BH-2", date: "20 Nov 2026", actor: "Java Sound Collective", note: "Rekening diperbarui" },
    ],
    verification: [{ label: "Surat izin penyelenggara", status: "Menunggu verifikasi" }],
    documents: [
      { id: "doc-3", label: "Surat izin penyelenggara", status: "Menunggu verifikasi", uploadedAt: "20 Nov 2026", reason: "", url: "" },
    ],
  },
};

const PROFILE_KEY = "lmi_eo_profiles";

const profileListeners = new Set();
const profileCache = new Map();

function readProfilesRaw() {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(PROFILE_KEY);
  } catch {
    return null;
  }
}

function readProfiles() {
  const raw = readProfilesRaw();
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function buildOrganization(penyelenggaraId, saved) {
  const base = DEFAULT_PROFILE[penyelenggaraId] ?? {
    name: "Penyelenggara Event",
    picName: "",
    description: "",
    logo: "/images/lmi-logo.png",
    logoData: "",
    email: "",
    phone: "",
    socials: { instagram: "", tiktok: "", website: "" },
    bank: { name: "", number: "", holder: "" },
    bankHistory: [],
    verification: [],
    documents: [],
  };

  if (!saved) return base;

  return {
    ...base,
    ...saved,
    socials: { ...base.socials, ...(saved.socials || {}) },
    bank: { ...base.bank, ...(saved.bank || {}) },
    documents: saved.documents ?? base.documents,
    bankHistory: saved.bankHistory ?? base.bankHistory,
  };
}

// Snapshot stabil untuk useSyncExternalStore: tidak ada hydration mismatch.
export function getOrganizationSnapshot(penyelenggaraId) {
  const raw = readProfilesRaw();
  const key = `${penyelenggaraId}||${raw ?? "default"}`;
  if (!profileCache.has(key)) {
    profileCache.set(
      key,
      buildOrganization(penyelenggaraId, raw ? readProfiles()[penyelenggaraId] : null)
    );
  }
  return profileCache.get(key);
}

export function getOrganizationServerSnapshot(penyelenggaraId) {
  return buildOrganization(penyelenggaraId, null);
}

export function subscribeProfiles(onChange) {
  profileListeners.add(onChange);
  if (typeof window === "undefined") return () => profileListeners.delete(onChange);

  const handleStorage = (event) => {
    if (event.key === PROFILE_KEY) onChange();
  };
  window.addEventListener("storage", handleStorage);

  return () => {
    profileListeners.delete(onChange);
    window.removeEventListener("storage", handleStorage);
  };
}

export function getOrganization(penyelenggaraId) {
  return getOrganizationSnapshot(penyelenggaraId);
}

export function getProfileStatus(profile) {
  const docs = profile?.documents ?? profile?.verification ?? [];
  if (docs.some((doc) => doc.status === "Ditolak")) return "Ditolak";
  if (docs.some((doc) => doc.status === "Menunggu verifikasi")) {
    return "Menunggu verifikasi";
  }
  if (docs.some((doc) => doc.status === "Kedaluwarsa")) return "Kedaluwarsa";
  if (docs.length && docs.every((doc) => doc.status === "Terverifikasi")) {
    return "Terverifikasi";
  }
  return "Belum diverifikasi";
}

export function saveOrganization(penyelenggaraId, profile) {
  if (typeof window === "undefined") return;
  try {
    const all = readProfiles();
    all[penyelenggaraId] = profile;
    window.localStorage.setItem(PROFILE_KEY, JSON.stringify(all));
    profileListeners.forEach((listener) => listener());
  } catch {
    // abaikan
  }
}

export function duplicateEvent(id) {
  const source = getEventById(id);
  if (!source) return null;

  const newId = createEventId();
  const copy = {
    ...source,
    id: newId,
    title: `${source.title} (Salinan)`,
    status: "draft",
    sold: 0,
    balance: 0,
    dailySales: [],
    ticketTypes: source.ticketTypes.map((ticket, index) => ({
      ...ticket,
      id: `tt-${newId}-${index + 1}`,
      sold: 0,
    })),
  };

  eventsStore = [copy, ...eventsStore];
  return copy;
}
