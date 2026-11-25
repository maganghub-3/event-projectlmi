import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility helper untuk menggabungkan class Tailwind secara aman
 * Digunakan oleh shadcn/ui dan komponen kustom
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
