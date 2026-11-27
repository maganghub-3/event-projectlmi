// Helper kecil untuk halaman login & daftar.

// Normalisasi nomor WhatsApp ke format +62xxxxxxxxxx. Mengembalikan null jika tidak valid.
// 0812..., 812..., 62812..., dan +62812... dianggap nomor yang sama.
export function normalizePhone(input = "") {
  let d = String(input).replace(/\D/g, "");
  if (d.startsWith("0")) d = "62" + d.slice(1);
  else if (d.startsWith("8")) d = "62" + d;
  return /^62\d{9,12}$/.test(d) ? "+" + d : null;
}

export function isEmail(value = "") {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

// Identitas login: email atau nomor WhatsApp. Null jika keduanya tidak valid.
export function parseIdentifier(input = "") {
  const value = String(input).trim();
  if (isEmail(value)) return { type: "email", value: value.toLowerCase() };
  const phone = normalizePhone(value);
  return phone ? { type: "phone", value: phone } : null;
}

// Hanya terima path internal (cegah open redirect lewat ?redirect=).
export function safeRedirect(path, fallback = "/") {
  if (
    typeof path === "string" &&
    path.startsWith("/") &&
    !path.startsWith("//") &&
    !path.includes("\\")
  ) {
    return path;
  }
  return fallback;
}

// Escape teks dari pengguna sebelum disisipkan ke HTML (misalnya di SweetAlert).
export function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Tujuan setelah login, ditentukan dari peran & status penyelenggara.
// Catatan: halaman /organizer/status belum tersedia, jadi EO yang masih
// menunggu verifikasi diarahkan ke ringkasan organizer.
export function getHomePath(user) {
  const roles = Array.isArray(user?.roles) ? user.roles : [];
  const organizerStatus = user?.organizer?.status;

  if (roles.includes("super_admin")) return "/dashboard-admin";
  if (roles.includes("crew")) return "/scan";
  if (roles.includes("organizer") && organizerStatus === "approved") {
    return "/dashboard-eo";
  }
  if (roles.includes("organizer") && organizerStatus === "pending") {
    return "/organizer";
  }
  return "/"; // pembeli biasa
}