"use client";

/**
 * ============================================================================
 * SWEETALERT2 — SATU PINTU UNTUK SEMUA NOTIFIKASI & KONFIRMASI
 * ============================================================================
 * Semua kebutuhan notifikasi/konfirmasi di aplikasi cukup import dari file ini:
 *
 *   import notify from "@/lib/sweetalert";
 *
 *   notify.toast("Pesan biasa"); // popup besar, auto-tutup 3 detik, ada tombol Oke & X
 *   notify.success("Berhasil disimpan");
 *   notify.error("Gagal memproses");
 *   notify.warning("Stok tiket hampir habis");
 *   notify.info("Info singkat");
 *
 *   const ok = await notify.confirm({ title: "Hapus data?" });
 *   await notify.alert({ title: "Berhasil!", icon: "success" });
 *   await notify.loading("Memproses...");
 *   await notify.close();
 *
 * SweetAlert2 di-load dinamis (hanya di browser) supaya aman untuk SSR.
 * ============================================================================
 */

const BRAND = "#3b4197";
const CANCEL = "#94a3b8";
const DANGER = "#e11d48";

let swalPromise = null;

function getSwal() {
  if (!swalPromise) {
    swalPromise = import("sweetalert2").then((mod) => mod.default);
  }
  return swalPromise;
}

/* -------------------------------------------------------------------------- */
/* Notifikasi (toast, non-blocking)                                            */
/* -------------------------------------------------------------------------- */

/**
 * Notifikasi berupa popup besar (bukan toast kecil).
 * Tutup otomatis setelah 3 detik, tapi bisa juga diklik "Oke" atau tombol X.
 *
 * @param {string} message
 * @param {{ icon?: "success"|"error"|"warning"|"info"|"question", timer?: number }} [options]
 */
export async function toast(message, options = {}) {
  const { icon, timer = 3000 } = options;
  const Swal = await getSwal();

  return Swal.fire({
    icon,
    title: message,
    width: "min(560px, 94vw)",
    padding: "2rem 2.25rem 1.75rem",
    timer,
    timerProgressBar: true,
    showCloseButton: true,
    closeButtonAriaLabel: "Tutup notifikasi",
    showConfirmButton: true,
    confirmButtonText: "Oke",
    confirmButtonColor: BRAND,
    customClass: {
      popup: "lmi-toast-big",
      title: "lmi-toast-big-title",
      confirmButton: "lmi-toast-big-btn",
    },
    didOpen: (element) => {
      element.addEventListener("mouseenter", Swal.stopTimer);
      element.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });
}

export function success(message, options = {}) {
  return toast(message, { ...options, icon: "success" });
}

export function error(message, options = {}) {
  return toast(message, { ...options, icon: "error" });
}

export function warning(message, options = {}) {
  return toast(message, { ...options, icon: "warning" });
}

export function info(message, options = {}) {
  return toast(message, { ...options, icon: "info" });
}

/* -------------------------------------------------------------------------- */
/* Konfirmasi (modal, blocking — dipakai saat aksi sudah terhubung backend)    */
/* -------------------------------------------------------------------------- */

/**
 * @returns {Promise<boolean>} true jika user menekan tombol konfirmasi
 */
export async function confirmAction({
  title,
  text,
  html,
  icon = "question",
  confirmText = "Ya, Lanjutkan",
  cancelText = "Batal",
  danger = false,
} = {}) {
  const Swal = await getSwal();

  const result = await Swal.fire({
    icon,
    title,
    text: html ? undefined : text,
    html,
    width: "min(720px, 94vw)",
    padding: "2.5rem 2.5rem 2rem",
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    confirmButtonColor: danger ? DANGER : BRAND,
    cancelButtonColor: CANCEL,
    reverseButtons: true,
    focusCancel: true,
    customClass: {
      popup: "lmi-confirm",
      title: "lmi-confirm-title",
      htmlContainer: "lmi-confirm-text",
      confirmButton: "lmi-confirm-btn",
      cancelButton: "lmi-confirm-btn",
    },
  });

  return result.isConfirmed;
}

/* -------------------------------------------------------------------------- */
/* Alert sederhana & loading                                                   */
/* -------------------------------------------------------------------------- */

export async function alert({
  title,
  text,
  html,
  icon = "info",
  confirmText = "Oke",
} = {}) {
  const Swal = await getSwal();

  return Swal.fire({
    icon,
    title,
    text: html ? undefined : text,
    html,
    width: "min(640px, 94vw)",
    padding: "2.5rem 2.5rem 2rem",
    confirmButtonText: confirmText,
    confirmButtonColor: BRAND,
    customClass: {
      popup: "lmi-confirm",
      title: "lmi-confirm-title",
      htmlContainer: "lmi-confirm-text",
      confirmButton: "lmi-confirm-btn",
    },
  });
}

export async function loading(title = "Memproses...") {
  const Swal = await getSwal();

  return Swal.fire({
    title,
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    didOpen: () => Swal.showLoading(),
  });
}

export async function close() {
  const Swal = await getSwal();
  Swal.close();
}

const notify = {
  toast,
  success,
  error,
  warning,
  info,
  confirm: confirmAction,
  alert,
  loading,
  close,
};

export default notify;
