"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Icon from "@/app/landing/Icon";
import Button from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import notify from "@/lib/sweetalert";
import { getHomePath, safeRedirect } from "@/lib/auth-utils";
import { saveSession } from "@/lib/session";
import { loginSchema } from "@/lib/schemas/auth";
import { BRAND } from "@/constants/brand";

// Taruh foto di public/images/foto-perusahaan.jpg (disarankan potret, sekitar 1200×1600 px).
const COMPANY_PHOTO = "/images/example.jpg";

// Akun dummy sementara untuk pengujian role & dashboard
const DUMMY_ACCOUNTS = [
  {
    email: "admin@lmi.id",
    password: "admin",
    name: "Super Admin",
    user: { id: "admin-1", roles: ["super_admin"], organizer: null },
  },
  {
    email: "eo@lmi.id",
    password: "eo123",
    name: "Kolektif Nada Nusantara",
    user: {
      id: "eo-1",
      penyelenggaraId: "pen-1",
      roles: ["organizer"],
      organizer: { status: "approved" },
    },
  },
  {
    email: "java@lmi.id",
    password: "java123",
    name: "Java Sound Collective",
    user: {
      id: "eo-2",
      penyelenggaraId: "pen-2",
      roles: ["organizer"],
      organizer: { status: "approved" },
    },
  },
  {
    email: "user@lmi.id",
    password: "user",
    name: "Pembeli / User",
    user: { id: "buyer-1", roles: ["buyer"], organizer: null },
  },
];

// Simulasi login sementara (nanti diganti dengan API backend sungguhan)
async function loginWithPassword(email, password) {
  await new Promise((r) => setTimeout(r, 500));

  // Cek apakah cocok dengan salah satu akun dummy terdaftar
  const found = DUMMY_ACCOUNTS.find(
    (acc) => acc.email.toLowerCase() === email.toLowerCase() && acc.password === password
  );

  if (found) {
    return {
      user: {
        name: found.name,
        email: found.email,
        ...found.user,
      },
    };
  }

  // Jika bukan akun dummy khusus di atas, izinkan login sebagai user/buyer biasa
  // asalkan password minimal 4 karakter (untuk fleksibilitas testing)
  if (password && password.length >= 4) {
    return {
      user: {
        name: email.split("@")[0],
        email,
        roles: ["buyer"],
        organizer: null,
      },
    };
  }

  throw new Error("Email atau kata sandi tidak cocok.");
}

function CompanyPhoto({ className = "" }) {
  return (
    <div className={`overflow-hidden bg-gradient-to-br from-brand-700 to-brand-900 ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={COMPANY_PHOTO}
        alt="Foto tim perusahaan"
        className="absolute inset-0 h-full w-full object-cover"
        onError={(e) => {
          e.currentTarget.style.display = "none";
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (values) => {
    setAuthError("");
    const cleanEmail = values.email.trim().toLowerCase();

    try {
      const { user } = await loginWithPassword(cleanEmail, values.password);
      saveSession(user, { remember: values.rememberMe });
      notify.toast("Login berhasil!");
      const redirect = new URLSearchParams(window.location.search).get("redirect");
      router.push(safeRedirect(redirect, getHomePath(user)));
    } catch {
      setAuthError("Email atau kata sandi tidak cocok. Silakan periksa kembali.");
    }
  };

  const handleForgotPassword = () => {
    notify.alert({
      title: "Lupa Kata Sandi?",
      html: "<p>Silakan hubungi administrator atau penyelenggara untuk mereset kata sandi akun Anda.</p>",
      icon: "info",
    });
  };

  return (
    <div className="min-h-screen bg-white lg:grid lg:grid-cols-2">
      {/* Foto perusahaan (desktop) */}
      <aside className="relative hidden lg:block">
        <CompanyPhoto className="absolute inset-0" />
        <div className="absolute bottom-12 left-12 right-12 text-white">
          <p className="max-w-sm text-2xl font-semibold leading-snug">
            {BRAND.tagline}
          </p>
        </div>
      </aside>

      <main className="flex min-h-screen flex-col">
        {/* Foto perusahaan (mobile) */}
        <CompanyPhoto className="relative h-36 lg:hidden" />

        <div className="px-6 pt-6 sm:px-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-slate-900"
          >
            <Icon name="arrowLeft" className="h-4 w-4" />
            <span>Kembali ke beranda</span>
          </Link>
        </div>

        <div className="mx-auto my-auto w-full max-w-sm px-6 py-10">
          <p className="mb-8 text-xl font-extrabold tracking-tight text-slate-900">
            {BRAND.name.toLowerCase()}
            <span className="text-brand-600">.</span>
          </p>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Masuk ke {BRAND.name}</h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            Masukkan email dan kata sandi Anda untuk mengakses akun.
          </p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="mt-8 space-y-4">
              {/* Input Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-700">Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        inputMode="email"
                        autoComplete="email"
                        autoFocus
                        placeholder="nama@email.com"
                        className="h-auto rounded-xl border-slate-200 px-4 py-3 text-sm shadow-none focus-visible:border-brand-500 focus-visible:ring-4 focus-visible:ring-brand-100"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          if (authError) setAuthError("");
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Input Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel className="text-sm font-medium text-slate-700">
                        Kata Sandi
                      </FormLabel>
                      <button
                        type="button"
                        onClick={handleForgotPassword}
                        className="text-xs font-semibold text-brand-600 hover:text-brand-700 transition"
                      >
                        Lupa sandi?
                      </button>
                    </div>
                    <div className="relative">
                      <FormControl>
                        <Input
                          type={showPassword ? "text" : "password"}
                          autoComplete="current-password"
                          placeholder="••••••••"
                          className="h-auto rounded-xl border-slate-200 px-4 py-3 pr-11 text-sm shadow-none focus-visible:border-brand-500 focus-visible:ring-4 focus-visible:ring-brand-100"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            if (authError) setAuthError("");
                          }}
                        />
                      </FormControl>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                        aria-label={showPassword ? "Sembunyikan kata sandi" : "Lihat kata sandi"}
                      >
                        <Icon name={showPassword ? "eyeOff" : "eye"} className="h-5 w-5" />
                      </button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Checkbox Ingat Saya */}
              <FormField
                control={form.control}
                name="rememberMe"
                render={({ field }) => (
                  <FormItem className="flex items-center pt-1 space-y-0">
                    <FormControl>
                      <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="rounded border-slate-300 text-brand-600 focus:ring-brand-500 h-4 w-4 cursor-pointer"
                        />
                        <span>Ingat saya di perangkat ini</span>
                      </label>
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Pesan Error */}
              {authError && (
                <p id="form-error" role="alert" className="text-sm text-red-600">
                  {authError}
                </p>
              )}

              {/* Tombol Masuk */}
              <Button
                type="submit"
                isLoading={form.formState.isSubmitting}
                variant="primary"
                size="lg"
                rounded="2xl"
                fullWidth
                className="mt-2"
              >
                Masuk
              </Button>
            </form>
          </Form>

          {/* Akun Demo Sementara */}
          <div className="mt-6 rounded-xl border border-dashed border-slate-200 bg-slate-50/80 p-3.5 text-xs text-slate-600">
            <p className="font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
              Akun Demo Sementara (Klik untuk isi cepat):
            </p>
            <div className="grid grid-cols-1 gap-1.5">
              {DUMMY_ACCOUNTS.map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => {
                    form.setValue("email", acc.email);
                    form.setValue("password", acc.password);
                    form.clearErrors();
                    setAuthError("");
                  }}
                  className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-left text-[11px] text-slate-700 hover:border-brand-500 hover:bg-brand-50/30 transition"
                >
                  <span className="font-medium text-slate-900">{acc.name}</span>
                  <span className="font-mono text-slate-500">
                    {acc.email} / {acc.password}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <p className="mt-6 text-xs leading-relaxed text-slate-400">
            Dengan masuk, Anda menyetujui Syarat &amp; Ketentuan dan Kebijakan Privasi {BRAND.name}.
          </p>
        </div>
      </main>
    </div>
  );
}
