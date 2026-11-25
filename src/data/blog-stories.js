/**
 * Data Terpusat Cerita & Kilas Event Kerjasama LMI Event
 * Digunakan pada Landing Page (#blog) dan Halaman Detail Dinamis (/blog/[slug])
 *
 * `photo` opsional: isi path lokal (mis. "/images/blog/jazz.jpg") atau URL remote.
 * Jika kosong, banner otomatis memakai gradient warna sesuai `gradient`.
 */

export const COLLABORATION_STORIES = [
  {
    id: "jazz-surabaya-2025",
    slug: "jazz-surabaya-2025",
    category: "musik",
    categoryLabel: "Konser Musik",
    title: "Surabaya Soundwave & Jazz Festival: Sukses Rangkul 8.500 Penonton Bersama LMI Event",
    partner: "PT Nada Nusantara Kreasi",
    city: "Surabaya",
    location: "Grand City Convention Hall, Surabaya",
    date: "12 - 14 Oktober 2025",
    year: "Oktober 2025",
    readTime: "4 menit baca",
    metrics: {
      tickets: "8.500+ Tiket",
      scanSpeed: "2 Detik / Penonton",
      soldOutTime: "Habis dalam 3 Hari",
      satisfaction: "99.4% Kepuasan Penonton",
    },
    photo:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80",
    gradient: "from-purple-600 via-indigo-600 to-brand-700",
    summary:
      "Tantangan antrean panjang di pintu gerbang berhasil diatasi dengan sistem gate check-in LMI Crew Scanner yang responsif secara offline maupun online.",
    quote:
      "“LMI Event menyelamatkan sistem ticketing kami! Tidak ada komplain tiket ganda dan antrean mengular di gerbang masuk. Paling keren laporan penjualannya real-time.”",
    partnerRep: "Budi Santoso — Head Producer PT Nada Nusantara Kreasi",
    overview:
      "Surabaya Soundwave & Jazz Festival adalah salah satu perhelatan musik jazz terbesar di Jawa Timur yang menghadirkan lebih dari 25 musisi nasional dan internasional selama 3 hari berturut-turut.",
    challenge:
      "Tahun sebelumnya, festival ini sempat mengalami penumpukan antrean hingga 45 menit di pintu masuk akibat koneksi internet seluler yang drop di area venue dan pemindaian barcode fisik yang lambat. Penyelenggara membutuhkan solusi gate management yang tangguh dan tidak bergantung pada sinyal internet yang tidak stabil.",
    solution:
      "LMI Event mengerahkan sistem LMI Crew Scanner berteknologi Hybrid Offline-Sync. Scanner tetap dapat memvalidasi keaslian tiket secara lokal dalam waktu kurang dari 2 detik per penonton, lalu menyinkronkan data secara otomatis ketika jaringan pulih. Selain itu, seluruh e-ticket dikirimkan langsung dengan format QR Code dinamis ke WhatsApp resmi pembeli.",
    results: [
      "8.500 tiket terjual habis melalui sistem presale berjenjang tanpa server down.",
      "Waktu rata-rata check-in di pintu gerbang hanya 1.8 detik per penonton.",
      "Zero fraud (nol tiket palsu atau duplikat) berkat validasi enkripsi token sekali pakai.",
      "Pencairan dana penjualan diselesaikan secara transparan dalam H+1 pasca acara.",
    ],
  },
  {
    id: "kuliner-nusantara-bandung",
    slug: "kuliner-nusantara-bandung",
    category: "festival",
    categoryLabel: "Festival Kuliner",
    title: "Pesta Kuliner Pedas Nusantara: Kelola 120 Tenant Makanan & 15.000 Pengunjung",
    partner: "Komunitas Foodies Jawa Barat",
    city: "Bandung",
    location: "Lapangan Gasibu & Gedung Sate, Bandung",
    date: "5 - 7 Desember 2025",
    year: "Desember 2025",
    readTime: "3 menit baca",
    metrics: {
      tickets: "15.000+ Tiket",
      scanSpeed: "Tiket Multi-Entry QR",
      soldOutTime: "Zero Downtime Server",
      satisfaction: "98.7% Pengunjung Puas",
    },
    photo:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80",
    gradient: "from-amber-500 via-orange-600 to-rose-600",
    summary:
      "Sistem tiket bundling multi-hari dan kupon cicip tenant LMI Event mempermudah pengunjung menikmati kuliner tanpa ribet uang kembalian tunai.",
    quote:
      "“Proses onboarding sangat cepat. H-7 kami baru ganti ticketing ke LMI Event dan acaranya sukses besar tanpa kendala sama sekali.”",
    partnerRep: "Sarah Dewi — Event Director Pesta Kuliner Bandung",
    overview:
      "Pesta Kuliner Pedas Nusantara mempertemukan lebih dari 120 UMKM kuliner otentik dari seluruh Indonesia dengan antusiasme ribuan penikmat kuliner di Kota Bandung.",
    challenge:
      "Dengan konsep festival 3 hari dan sistem tiket masuk yang mencakup voucher makan tenant, panitia kesulitan mengontrol tiket masuk harian dan memverifikasi keabsahan voucher makan fisik yang rawan dipalsukan.",
    solution:
      "LMI Event menyediakan tiket terpadu bertipe Multi-Pass yang menyertakan saldo kupon cicip digital di dalam QR Code tiket. Pengunjung cukup men-scan kode yang sama di gerbang masuk maupun di kasir tenant kuliner rekanan.",
    results: [
      "15.000 tiket multi-entry sukses divalidasi sepanjang 3 hari penyelenggaraan.",
      "Tenant UMKM mencatatkan kenaikan omzet 40% berkat transaksi voucher digital yang seamless.",
      "Pengunjung terhindar dari antrean panjang di loket penukaran fisik.",
    ],
  },
  {
    id: "wellness-run-jakarta",
    slug: "wellness-run-jakarta",
    category: "olahraga",
    categoryLabel: "Olahraga & Komunitas",
    title: "Jakarta City Sunset Run 10K: Dari Pendaftaran hingga Race Pack Terdistribusi Rapi",
    partner: "IndoRunners Jakarta Community",
    city: "Jakarta",
    location: "Kawasan Gelora Bung Karno (GBK), Jakarta",
    date: "18 Januari 2026",
    year: "Januari 2026",
    readTime: "4 menit baca",
    metrics: {
      tickets: "3.200 Pelari",
      scanSpeed: "Pengambilan BIB Cepat",
      soldOutTime: "Early Bird 4 Jam",
      satisfaction: "99.8% Pelari Puas",
    },
    photo:
      "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=1200&q=80",
    gradient: "from-emerald-500 via-teal-600 to-cyan-700",
    summary:
      "Form pendaftaran kustom dengan ukuran kaos BIB runner terintegrasi langsung dalam checkout tiket, mengurangi kesalahan pendataan logistik peserta.",
    quote:
      "“Fitur formulir kustom di LMI Event sangat membantu pengumpulan data medis dan ukuran jersey pelari secara akurat dan instan.”",
    partnerRep: "Arif Gunawan — Ketua Panitia Pelaksana Jakarta Sunset Run",
    overview:
      "Jakarta City Sunset Run 10K adalah ajang lari sore santai komunitas dengan rute ikonik mengelilingi jalan protokol ibu kota saat matahari terbenam.",
    challenge:
      "Pendaftaran event lari membutuhkan data spesifik: ukuran kaos jersey, riwayat medis darurat, kontak darurat, serta kategori usia. Sistem formulir standar seringkali gagal mencatat data ini secara lengkap.",
    solution:
      "LMI Event mengaktifkan Custom Registration Fields pada formulir pemesanan. Peserta tidak dapat menyelesaikan pembayaran sebelum memilih ukuran jersey yang tersedia secara real-time berdasarkan kuota stok panitia.",
    results: [
      "3.200 tiket kategori 5K dan 10K terisi penuh dengan data peserta 100% lengkap.",
      "Distribusi Race Pack Collection (RPC) berlangsung 3x lebih cepat dengan scan barcode verifikasi.",
      "Panitia tidak memiliki kelebihan atau kekurangan stok jersey pelari.",
    ],
  },
  {
    id: "creative-summit-jogja",
    slug: "creative-summit-jogja",
    category: "workshop",
    categoryLabel: "Workshop & Edukasi",
    title: "Jogja Creative Art & Digital Summit: Menghubungkan 1.800 Desainer & Kreator",
    partner: "Studio Kolektif Yogyakarta",
    city: "Yogyakarta",
    location: "Jogja Expo Center (JEC), Yogyakarta",
    date: "14 - 15 Februari 2026",
    year: "Februari 2026",
    readTime: "3 menit baca",
    metrics: {
      tickets: "1.800 Peserta",
      scanSpeed: "Akses 14 Sesi Terpisah",
      soldOutTime: "Terjual Maksimal",
      satisfaction: "99.1% Peserta Puas",
    },
    photo:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80",
    gradient: "from-rose-500 via-pink-600 to-purple-700",
    summary:
      "Fitur breakout-session tiket memungkinkan peserta memilih kelas workshop paralel dalam satu invoice pembelian yang terstruktur rapi.",
    quote:
      "“Peserta workshop sangat mengapresiasi kemudahan menerima e-ticket langsung ke WhatsApp. Tim panitia kami hemat waktu dan tenaga.”",
    partnerRep: "Melani Putri — Koordinator Program Studio Kolektif Jogja",
    overview:
      "Sebuah konferensi dan pameran interaktif dua hari yang membahas masa depan industri kreatif, animasi, AI generatif, dan seni visual di Asia Tenggara.",
    challenge:
      "Acara memiliki 1 panggung utama dan 14 ruang kelas workshop paralel dengan kuota terbatas per ruangan (maksimal 50 orang per kelas). Panitia membutuhkan sistem tiket yang dapat membatasi kuota tiap sesi tanpa membingungkan pendaftar.",
    solution:
      "LMI Event menerapkan fitur Session-Based Ticketing. Pembeli dapat memilih sesi workshop yang diinginkan langsung saat membeli tiket terusan, dan sistem otomatis mengunci sesi yang sudah memenuhi kuota.",
    results: [
      "Seluruh 14 sesi workshop terisi optimal tanpa overcapacity.",
      "Check-in antar ruangan menggunakan tablet scanner LMI berjalan tertib dan tepat waktu.",
      "Sertifikat elektronik kehadiran otomatis terkirim pasca-acara.",
    ],
  },
];

export function getStoryBySlug(slug) {
  if (!slug) return null;
  const clean = String(slug).toLowerCase();
  return (
    COLLABORATION_STORIES.find(
      (s) => s.slug.toLowerCase() === clean || s.id.toLowerCase() === clean
    ) || null
  );
}
