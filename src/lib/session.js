// Penyimpanan sesi login sisi klien (sementara, sebelum backend disambungkan).
// "Ingat saya" => localStorage, selain itu => sessionStorage.

const SESSION_KEY = "lmi_session";
const SESSION_EVENT = "lmi:session";

function getStorage(kind) {
  if (typeof window === "undefined") return null;
  try {
    return kind === "session" ? window.sessionStorage : window.localStorage;
  } catch {
    return null;
  }
}

function readRawSession() {
  if (typeof window === "undefined") return null;

  try {
    return (
      window.sessionStorage.getItem(SESSION_KEY) ??
      window.localStorage.getItem(SESSION_KEY)
    );
  } catch {
    return null;
  }
}

function notifySessionChange() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(SESSION_EVENT));
}

export function saveSession(user, { remember = true } = {}) {
  if (typeof window === "undefined") return;

  const target = getStorage(remember ? "local" : "session");
  const other = getStorage(remember ? "session" : "local");

  try {
    other?.removeItem(SESSION_KEY);
    target?.setItem(SESSION_KEY, JSON.stringify(user));
    notifySessionChange();
  } catch {
    // Storage penuh / diblokir: abaikan.
  }
}

export function clearSession() {
  for (const kind of ["session", "local"]) {
    try {
      getStorage(kind)?.removeItem(SESSION_KEY);
    } catch {
      // abaikan
    }
  }
  notifySessionChange();
}

// Snapshot stabil untuk useSyncExternalStore: objek hanya dibuat ulang
// ketika isi storage benar-benar berubah.
let cachedRaw;
let cachedSession = null;

export function getSessionSnapshot() {
  const raw = readRawSession();
  if (raw === cachedRaw) return cachedSession;

  cachedRaw = raw;

  if (!raw) {
    cachedSession = null;
    return cachedSession;
  }

  try {
    const parsed = JSON.parse(raw);
    cachedSession = parsed && Array.isArray(parsed.roles) ? parsed : null;
  } catch {
    cachedSession = null;
  }

  return cachedSession;
}

export function subscribeSession(onChange) {
  if (typeof window === "undefined") return () => {};

  window.addEventListener("storage", onChange);
  window.addEventListener(SESSION_EVENT, onChange);

  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(SESSION_EVENT, onChange);
  };
}

export function getSession() {
  return getSessionSnapshot();
}

export function hasRole(user, roles) {
  if (!user || !Array.isArray(user.roles)) return false;

  const allowed = Array.isArray(roles) ? roles : [roles];
  return allowed.some((role) => user.roles.includes(role));
}

export function userInitials(name = "", fallback = "U") {
  const initials = String(name)
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  return initials || fallback;
}
