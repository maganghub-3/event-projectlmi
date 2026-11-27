"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Icon from "./Icon";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import notify from "@/lib/sweetalert";
import { newsletterSchema } from "@/lib/schemas/newsletter";
import { BRAND } from "@/constants/brand";

export const FAQS = [
  {
    q: "Gimana kalau acaraku mendadak ditunda atau dibatalkan promotor?",
    a: `Tenang saja! Di ${BRAND.name} ada Garansi Pengembalian 100%. Jika ada perubahan jadwal atau pembatalan dari pihak penyelenggara, dana tiketmu akan dikembalikan penuh ke rekeningmu tanpa potongan sepeser pun.`,
  },
  {
    q: "Apakah e-ticket perlu dicetak di atas kertas?",
    a: "Sama sekali tidak perlu! Kamu cukup memperlihatkan barcode atau QR Code yang dikirim ke email dan WhatsApp kamu langsung dari layar smartphone di gerbang masuk.",
  },
  {
    q: "Apakah tiket bisa dipindahtangankan ke teman?",
    a: "Bisa banget! Di halaman akunmu, kamu bisa melakukan 'Transfer Tiket ke Teman' cukup dengan memasukkan nomor WhatsApp atau email temanmu.",
  },
  {
    q: "Metode pembayaran apa saja yang didukung?",
    a: "Kami mendukung QRIS (BCA, GoPay, OVO, Dana, ShopeePay), Transfer Bank Virtual Account, Kartu Kredit/Debit, dan gerai minimarket.",
  },
];

export default function BantuanSection() {
  const [openFaq, setOpenFaq] = useState(0);
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const form = useForm({
    resolver: zodResolver(newsletterSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmitNewsletter = () => {
    setNewsletterSubscribed(true);
    notify.toast("Berhasil berlangganan buletin mingguan!");
    form.reset();
  };

  return (
    <>
      {/* 1. FAQ ACCORDION SECTION */}
      <section id="bantuan" className="py-16 max-w-4xl mx-auto px-4 sm:px-6 scroll-mt-20">
        <div className="text-center mb-10">
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
            Pusat Bantuan &amp; FAQ
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-2">
            Ada yang Ingin Ditanyakan?
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Jawaban cepat untuk hal-hal yang paling sering ditanyakan oleh teman-teman penonton.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={faq.q}
                data-reveal="bottom"
                style={{ transitionDelay: `${idx * 70}ms` }}
                className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-slate-900 hover:text-brand-700 transition"
                >
                  <span>{faq.q}</span>
                  <div className={`p-1.5 rounded-full bg-slate-100 text-slate-500 transition-transform ${isOpen ? "rotate-180 bg-brand-100 text-brand-700" : ""}`}>
                    <Icon name="chevronDown" className="w-4 h-4" />
                  </div>
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 2. FRIENDLY NEWSLETTER SECTION */}
      <section className="py-14 bg-brand-50/70 border-t border-brand-200/60">
        <div data-reveal="bottom" className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <Icon name="mail" className="h-8 w-8 text-brand-600" />
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            Dapatkan Ide Hangout Tiap Kamis Sore!
          </h2>
          <p className="text-sm text-slate-600 max-w-lg mx-auto">
            Biar akhir pekanmu nggak cuma rebahan, kami kirim kurasi event seru dan voucher spesial langsung ke emailmu. (Janji no spam)
          </p>

          {newsletterSubscribed ? (
            <div className="p-4 bg-emerald-100 text-emerald-800 rounded-2xl font-bold text-sm max-w-md mx-auto border border-emerald-300">
              Terima kasih! Kamu sudah terdaftar di buletin mingguan Teman {BRAND.name}.
            </div>
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmitNewsletter)}
                noValidate
                className="flex flex-col sm:flex-row items-start gap-2.5 max-w-md mx-auto pt-2"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="w-full text-left">
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Masukkan alamat emailmu..."
                          className="h-auto rounded-2xl border-slate-300 bg-white px-4 py-3 text-sm font-medium shadow-none focus-visible:border-brand-600 focus-visible:ring-0"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 bg-slate-900 hover:bg-black text-white font-bold rounded-2xl text-sm shrink-0 shadow-md transition"
                >
                  Langganan
                </button>
              </form>
            </Form>
          )}
        </div>
      </section>
    </>
  );
}
