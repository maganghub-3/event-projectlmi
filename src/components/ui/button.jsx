"use client";

import * as React from "react";
import Link from "next/link";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Komponen Tombol Terpusat (Shadcn UI + Fitur Lengkap LMI Event)
 *
 * Mendukung:
 * - cva & cn() standar shadcn/ui
 * - Otomatis menjadi Next.js <Link> jika terdapat prop `href`
 * - Animasi spinner saat `isLoading={true}`
 * - Slot `leftIcon` dan `rightIcon`
 * - Ragam varian warna khas LMI Event & varian standar
 * - Ragam bentuk sudut `rounded` ("full" | "2xl" | "xl" | "lg" | "md")
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center font-bold select-none cursor-pointer transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none disabled:transform-none",
  {
    variants: {
      variant: {
        // Varian Utama LMI Event (Gradient)
        default:
          "bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 text-white shadow-md shadow-brand-600/25 hover:shadow-brand-600/40 hover:-translate-y-0.5 active:translate-y-0",
        primary:
          "bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 text-white shadow-md shadow-brand-600/25 hover:shadow-brand-600/40 hover:-translate-y-0.5 active:translate-y-0",
        
        // Varian Sekunder Lembut
        secondary:
          "bg-brand-50 hover:bg-brand-100 text-brand-700 border border-brand-200/80 hover:-translate-y-0.5 active:translate-y-0",
        
        // Varian Garis Tepi (Outline)
        outline:
          "bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 hover:border-brand-300 hover:text-brand-700 shadow-sm hover:-translate-y-0.5 active:translate-y-0",
        
        // Varian Bersih (Ghost)
        ghost:
          "bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900",
        
        // Varian Gelap / Hitam
        dark:
          "bg-slate-900 hover:bg-black text-white shadow-md shadow-slate-900/20 hover:-translate-y-0.5 active:translate-y-0",
        
        // Varian Putih Solid
        white:
          "bg-white hover:bg-slate-50 text-brand-700 border border-slate-200/70 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0",
        
        // Varian Bahaya / Merah
        destructive:
          "bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/20 hover:-translate-y-0.5 active:translate-y-0",
        danger:
          "bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/20 hover:-translate-y-0.5 active:translate-y-0",
        
        // Varian Link
        link:
          "text-primary underline-offset-4 hover:underline font-semibold",
      },
      size: {
        default: "text-sm px-5 py-2.5 gap-2",
        md: "text-sm px-5 py-2.5 gap-2",
        sm: "text-xs px-3.5 py-1.5 gap-1.5",
        lg: "text-base px-6 py-3.5 gap-2.5 font-extrabold",
        icon: "h-10 w-10 p-2.5",
      },
      rounded: {
        full: "rounded-full",
        "2xl": "rounded-2xl",
        xl: "rounded-xl",
        lg: "rounded-lg",
        md: "rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      rounded: "full",
    },
  }
);

function Button({
  children,
  className,
  variant = "default",
  size = "default",
  rounded = "full",
  isLoading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  href,
  fullWidth = false,
  type = "button",
  ...props
}) {
  const appliedClass = cn(
    buttonVariants({ variant, size, rounded, className }),
    fullWidth && "w-full"
  );

  const content = (
    <>
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
      ) : (
        leftIcon && <span className="shrink-0">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </>
  );

  // Jika terdapat prop href, render otomatis sebagai Next.js Link
  if (href && !disabled) {
    return (
      <Link href={href} className={appliedClass} {...props}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={appliedClass}
      {...props}
    >
      {content}
    </button>
  );
}

export { Button, buttonVariants };
export default Button;
