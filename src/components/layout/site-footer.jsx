import Link from "next/link";
import Image from "next/image";
import Icon from "@/app/landing/Icon";
import { BRAND } from "@/constants/brand";
import { CONTACT } from "@/constants/contact";

/**
 * Footer ringkas untuk halaman di luar landing (detail event, hubungi kami).
 * Landing punya footer sendiri karena terhubung ke filter kota & kategori.
 */
export default function SiteFooter() {
  return (
    <footer className="mt-auto bg-slate-900 text-slate-300 pt-14 pb-10 border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid gap-10 md:grid-cols-4 pb-10 border-b border-slate-800">
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center" aria-label="LMI Event - Beranda">
              <Image
                src="/images/lmi-logo.png"
                alt="LMI Event - Lembaga Manajemen Infaq"
                width={144}
                height={70}
                className="h-auto w-32"
              />
            </Link>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Platform tiket event paling ramah di Indonesia. Kami menghubungkan
              pencinta musik, seni, kuliner, dan komunitas dengan pengalaman tak
              terlupakan.
            </p>
            <div className="flex items-center gap-3 text-slate-400">
              <Icon name="camera" className="h-5 w-5 cursor-pointer hover:text-brand-400 transition" />
              <Icon name="music" className="h-5 w-5 cursor-pointer hover:text-brand-400 transition" />
              <Icon name="chat" className="h-5 w-5 cursor-pointer hover:text-brand-400 transition" />
              <Icon name="globe" className="h-5 w-5 cursor-pointer hover:text-brand-400 transition" />
            </div>
          </div>

          <div>
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">
              Jelajahi
            </h2>
            <ul className="mt-3 space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/#event" className="hover:text-white transition">
                  Event
                </Link>
              </li>
              <li>
                <Link href="/#kategori" className="hover:text-white transition">
                  Kategori
                </Link>
              </li>
              <li>
                <Link href="/#blog" className="hover:text-white transition">
                  Blog &amp; Berita
                </Link>
              </li>
              <li>
                <Link href="/#bantuan" className="hover:text-white transition">
                  Pusat Bantuan
                </Link>
              </li>
              <li>
                <Link href="/pesanan" className="hover:text-white transition">
                  Pesanan &amp; Tiket Saya
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">
              Hubungi Kami
            </h2>
            <ul className="mt-3 space-y-2 text-xs text-slate-400">
              <li>
                <span className="text-slate-300 font-medium">WhatsApp CS:</span>{" "}
                {CONTACT.whatsappDisplay}
              </li>
              <li>
                <span className="text-slate-300 font-medium">Email:</span>{" "}
                {BRAND.email}
              </li>
              <li>
                <span className="text-slate-300 font-medium">Jam Layanan:</span>{" "}
                {CONTACT.serviceHours}
              </li>
              <li>
                <Link href="/hubungi-kami" className="hover:text-white underline transition">
                  Kirim pesan ke tim kami
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <p className="pt-6 text-xs text-slate-500">{BRAND.copyright}</p>
      </div>
    </footer>
  );
}
