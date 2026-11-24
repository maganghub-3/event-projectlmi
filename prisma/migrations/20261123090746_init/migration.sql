-- CreateEnum
CREATE TYPE "peran_pengguna" AS ENUM ('PEMBELI', 'ADMIN_EVENT', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "status_pengguna" AS ENUM ('AKTIF', 'DIBLOKIR');

-- CreateEnum
CREATE TYPE "status_penyelenggara" AS ENUM ('AKTIF', 'NONAKTIF');

-- CreateEnum
CREATE TYPE "visibilitas_event" AS ENUM ('PUBLIK', 'PRIVAT');

-- CreateEnum
CREATE TYPE "status_event" AS ENUM ('DRAFT', 'PUBLISH');

-- CreateEnum
CREATE TYPE "jenis_potongan" AS ENUM ('PERSEN', 'NOMINAL');

-- CreateEnum
CREATE TYPE "jenis_biaya" AS ENUM ('PERSEN', 'NOMINAL');

-- CreateEnum
CREATE TYPE "sumber_pesanan" AS ENUM ('ONLINE', 'OFFLINE');

-- CreateEnum
CREATE TYPE "status_pesanan" AS ENUM ('MENUNGGU', 'DIBAYAR', 'KEDALUWARSA', 'DIBATALKAN');

-- CreateEnum
CREATE TYPE "metode_pembayaran" AS ENUM ('VA', 'QRIS', 'EWALLET', 'KARTU_KREDIT', 'TUNAI');

-- CreateEnum
CREATE TYPE "status_pembayaran" AS ENUM ('MENUNGGU', 'BERHASIL', 'GAGAL', 'KEDALUWARSA');

-- CreateEnum
CREATE TYPE "status_tiket" AS ENUM ('VALID', 'TERPAKAI', 'DIBATALKAN');

-- CreateEnum
CREATE TYPE "metode_validasi" AS ENUM ('OTOMATIS', 'MANUAL');

-- CreateEnum
CREATE TYPE "hasil_validasi" AS ENUM ('BERHASIL', 'DITOLAK');

-- CreateEnum
CREATE TYPE "status_penarikan" AS ENUM ('MENUNGGU', 'DISETUJUI', 'DITOLAK', 'DICAIRKAN');

-- CreateEnum
CREATE TYPE "status_berita" AS ENUM ('DRAFT', 'PUBLISH');

-- CreateTable
CREATE TABLE "pengguna" (
    "id" SERIAL NOT NULL,
    "penyelenggara_id" INTEGER,
    "nama" VARCHAR(150) NOT NULL,
    "email" VARCHAR(191) NOT NULL,
    "kata_sandi_hash" VARCHAR(255) NOT NULL,
    "no_hp" VARCHAR(30),
    "peran" "peran_pengguna" NOT NULL DEFAULT 'PEMBELI',
    "status" "status_pengguna" NOT NULL DEFAULT 'AKTIF',
    "kota" VARCHAR(100),
    "tanggal_lahir" DATE,
    "no_identitas" VARCHAR(50),
    "dibuat_pada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pengguna_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reset_kata_sandi" (
    "id" SERIAL NOT NULL,
    "pengguna_id" INTEGER NOT NULL,
    "token" VARCHAR(191) NOT NULL,
    "kedaluwarsa_pada" TIMESTAMP(3) NOT NULL,
    "digunakan_pada" TIMESTAMP(3),
    "dibuat_pada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reset_kata_sandi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "log_audit" (
    "id" SERIAL NOT NULL,
    "pengguna_id" INTEGER,
    "aksi" VARCHAR(100) NOT NULL,
    "jenis_entitas" VARCHAR(100) NOT NULL,
    "entitas_id" INTEGER,
    "nilai_lama" JSONB,
    "nilai_baru" JSONB,
    "dibuat_pada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "log_audit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "penyelenggara" (
    "id" SERIAL NOT NULL,
    "nama" VARCHAR(150) NOT NULL,
    "logo" VARCHAR(255),
    "deskripsi" TEXT,
    "email_kontak" VARCHAR(191),
    "telepon_kontak" VARCHAR(30),
    "status" "status_penyelenggara" NOT NULL DEFAULT 'AKTIF',
    "dibuat_pada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "diperbarui_pada" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "penyelenggara_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "penarikan_dana" (
    "id" SERIAL NOT NULL,
    "penyelenggara_id" INTEGER NOT NULL,
    "jumlah" DECIMAL(14,2) NOT NULL,
    "nama_bank" VARCHAR(100) NOT NULL,
    "nomor_rekening" VARCHAR(50) NOT NULL,
    "nama_pemilik_rekening" VARCHAR(150) NOT NULL,
    "status" "status_penarikan" NOT NULL DEFAULT 'MENUNGGU',
    "diajukan_pada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "penarikan_dana_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event" (
    "id" SERIAL NOT NULL,
    "penyelenggara_id" INTEGER NOT NULL,
    "nama" VARCHAR(200) NOT NULL,
    "poster" VARCHAR(255),
    "lokasi" VARCHAR(200),
    "kota" VARCHAR(100),
    "deskripsi" TEXT,
    "syarat_ketentuan" TEXT,
    "mulai_pada" TIMESTAMP(3) NOT NULL,
    "selesai_pada" TIMESTAMP(3),
    "visibilitas" "visibilitas_event" NOT NULL DEFAULT 'PUBLIK',
    "status" "status_event" NOT NULL DEFAULT 'DRAFT',
    "dibuat_pada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "diperbarui_pada" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kategori_tiket" (
    "id" SERIAL NOT NULL,
    "event_id" INTEGER NOT NULL,
    "nama" VARCHAR(150) NOT NULL,
    "harga" DECIMAL(14,2) NOT NULL,
    "kuota" INTEGER NOT NULL,
    "jadwal_pada" TIMESTAMP(3),
    "penjualan_mulai" TIMESTAMP(3),
    "penjualan_selesai" TIMESTAMP(3),

    CONSTRAINT "kategori_tiket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "paket_bundling" (
    "id" SERIAL NOT NULL,
    "kategori_tiket_id" INTEGER NOT NULL,
    "nama" VARCHAR(150) NOT NULL,
    "jumlah" INTEGER NOT NULL,
    "harga" DECIMAL(14,2) NOT NULL,

    CONSTRAINT "paket_bundling_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kode_promo" (
    "id" SERIAL NOT NULL,
    "event_id" INTEGER NOT NULL,
    "kode" VARCHAR(50) NOT NULL,
    "jenis_potongan" "jenis_potongan" NOT NULL,
    "nilai_potongan" DECIMAL(14,2) NOT NULL,
    "kuota" INTEGER NOT NULL,
    "jumlah_dipakai" INTEGER NOT NULL DEFAULT 0,
    "berlaku_dari" TIMESTAMP(3),
    "berlaku_sampai" TIMESTAMP(3),
    "aktif" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "kode_promo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pesanan" (
    "id" SERIAL NOT NULL,
    "nomor_pesanan" VARCHAR(50) NOT NULL,
    "event_id" INTEGER NOT NULL,
    "pengguna_id" INTEGER,
    "kode_promo_id" INTEGER,
    "dijual_oleh" INTEGER,
    "sumber" "sumber_pesanan" NOT NULL DEFAULT 'ONLINE',
    "nama_pembeli" VARCHAR(150) NOT NULL,
    "email_pembeli" VARCHAR(191),
    "telepon_pembeli" VARCHAR(30),
    "subtotal" DECIMAL(14,2) NOT NULL,
    "potongan" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "biaya_admin" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "total" DECIMAL(14,2) NOT NULL,
    "status" "status_pesanan" NOT NULL DEFAULT 'MENUNGGU',
    "kedaluwarsa_pada" TIMESTAMP(3),
    "dibuat_pada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pesanan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "item_pesanan" (
    "id" SERIAL NOT NULL,
    "pesanan_id" INTEGER NOT NULL,
    "kategori_tiket_id" INTEGER NOT NULL,
    "paket_bundling_id" INTEGER,
    "jumlah" INTEGER NOT NULL,
    "harga_satuan" DECIMAL(14,2) NOT NULL,
    "subtotal" DECIMAL(14,2) NOT NULL,

    CONSTRAINT "item_pesanan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pembayaran" (
    "id" SERIAL NOT NULL,
    "pesanan_id" INTEGER NOT NULL,
    "metode" "metode_pembayaran" NOT NULL,
    "referensi_gateway" VARCHAR(191),
    "jumlah" DECIMAL(14,2) NOT NULL,
    "status" "status_pembayaran" NOT NULL DEFAULT 'MENUNGGU',
    "dibayar_pada" TIMESTAMP(3),

    CONSTRAINT "pembayaran_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tiket" (
    "id" SERIAL NOT NULL,
    "item_pesanan_id" INTEGER NOT NULL,
    "kode_qr" VARCHAR(191) NOT NULL,
    "nama_pemegang" VARCHAR(150),
    "no_identitas_pemegang" VARCHAR(50),
    "status" "status_tiket" NOT NULL DEFAULT 'VALID',
    "dibuat_pada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tiket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "validasi_tiket" (
    "id" SERIAL NOT NULL,
    "tiket_id" INTEGER NOT NULL,
    "dipindai_oleh" INTEGER NOT NULL,
    "metode" "metode_validasi" NOT NULL,
    "hasil" "hasil_validasi" NOT NULL,
    "dipindai_pada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "validasi_tiket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "berita" (
    "id" SERIAL NOT NULL,
    "dibuat_oleh" INTEGER NOT NULL,
    "judul" VARCHAR(200) NOT NULL,
    "slug" VARCHAR(200) NOT NULL,
    "gambar" VARCHAR(255),
    "isi" TEXT NOT NULL,
    "status" "status_berita" NOT NULL DEFAULT 'DRAFT',
    "diterbitkan_pada" TIMESTAMP(3),
    "dibuat_pada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "diperbarui_pada" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "berita_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "biaya_platform" (
    "id" SERIAL NOT NULL,
    "nama" VARCHAR(100) NOT NULL,
    "jenis_biaya" "jenis_biaya" NOT NULL,
    "nilai_biaya" DECIMAL(14,2) NOT NULL,
    "aktif" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "biaya_platform_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pengaturan_sistem" (
    "id" SERIAL NOT NULL,
    "kunci" VARCHAR(100) NOT NULL,
    "nilai" TEXT NOT NULL,
    "diperbarui_pada" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pengaturan_sistem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pengguna_email_key" ON "pengguna"("email");

-- CreateIndex
CREATE INDEX "pengguna_penyelenggara_id_idx" ON "pengguna"("penyelenggara_id");

-- CreateIndex
CREATE INDEX "pengguna_peran_idx" ON "pengguna"("peran");

-- CreateIndex
CREATE UNIQUE INDEX "reset_kata_sandi_token_key" ON "reset_kata_sandi"("token");

-- CreateIndex
CREATE INDEX "reset_kata_sandi_pengguna_id_idx" ON "reset_kata_sandi"("pengguna_id");

-- CreateIndex
CREATE INDEX "log_audit_pengguna_id_idx" ON "log_audit"("pengguna_id");

-- CreateIndex
CREATE INDEX "log_audit_jenis_entitas_entitas_id_idx" ON "log_audit"("jenis_entitas", "entitas_id");

-- CreateIndex
CREATE INDEX "penarikan_dana_penyelenggara_id_idx" ON "penarikan_dana"("penyelenggara_id");

-- CreateIndex
CREATE INDEX "event_penyelenggara_id_idx" ON "event"("penyelenggara_id");

-- CreateIndex
CREATE INDEX "event_status_visibilitas_mulai_pada_idx" ON "event"("status", "visibilitas", "mulai_pada");

-- CreateIndex
CREATE INDEX "event_kota_idx" ON "event"("kota");

-- CreateIndex
CREATE INDEX "kategori_tiket_event_id_idx" ON "kategori_tiket"("event_id");

-- CreateIndex
CREATE INDEX "paket_bundling_kategori_tiket_id_idx" ON "paket_bundling"("kategori_tiket_id");

-- CreateIndex
CREATE UNIQUE INDEX "kode_promo_event_id_kode_key" ON "kode_promo"("event_id", "kode");

-- CreateIndex
CREATE UNIQUE INDEX "pesanan_nomor_pesanan_key" ON "pesanan"("nomor_pesanan");

-- CreateIndex
CREATE INDEX "pesanan_event_id_idx" ON "pesanan"("event_id");

-- CreateIndex
CREATE INDEX "pesanan_pengguna_id_idx" ON "pesanan"("pengguna_id");

-- CreateIndex
CREATE INDEX "pesanan_kode_promo_id_idx" ON "pesanan"("kode_promo_id");

-- CreateIndex
CREATE INDEX "pesanan_dijual_oleh_idx" ON "pesanan"("dijual_oleh");

-- CreateIndex
CREATE INDEX "pesanan_status_dibuat_pada_idx" ON "pesanan"("status", "dibuat_pada");

-- CreateIndex
CREATE INDEX "item_pesanan_pesanan_id_idx" ON "item_pesanan"("pesanan_id");

-- CreateIndex
CREATE INDEX "item_pesanan_kategori_tiket_id_idx" ON "item_pesanan"("kategori_tiket_id");

-- CreateIndex
CREATE INDEX "item_pesanan_paket_bundling_id_idx" ON "item_pesanan"("paket_bundling_id");

-- CreateIndex
CREATE INDEX "pembayaran_pesanan_id_idx" ON "pembayaran"("pesanan_id");

-- CreateIndex
CREATE INDEX "pembayaran_referensi_gateway_idx" ON "pembayaran"("referensi_gateway");

-- CreateIndex
CREATE UNIQUE INDEX "tiket_kode_qr_key" ON "tiket"("kode_qr");

-- CreateIndex
CREATE INDEX "tiket_item_pesanan_id_idx" ON "tiket"("item_pesanan_id");

-- CreateIndex
CREATE INDEX "validasi_tiket_tiket_id_idx" ON "validasi_tiket"("tiket_id");

-- CreateIndex
CREATE INDEX "validasi_tiket_dipindai_oleh_idx" ON "validasi_tiket"("dipindai_oleh");

-- CreateIndex
CREATE UNIQUE INDEX "berita_slug_key" ON "berita"("slug");

-- CreateIndex
CREATE INDEX "berita_dibuat_oleh_idx" ON "berita"("dibuat_oleh");

-- CreateIndex
CREATE UNIQUE INDEX "pengaturan_sistem_kunci_key" ON "pengaturan_sistem"("kunci");

-- AddForeignKey
ALTER TABLE "pengguna" ADD CONSTRAINT "pengguna_penyelenggara_id_fkey" FOREIGN KEY ("penyelenggara_id") REFERENCES "penyelenggara"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reset_kata_sandi" ADD CONSTRAINT "reset_kata_sandi_pengguna_id_fkey" FOREIGN KEY ("pengguna_id") REFERENCES "pengguna"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "log_audit" ADD CONSTRAINT "log_audit_pengguna_id_fkey" FOREIGN KEY ("pengguna_id") REFERENCES "pengguna"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "penarikan_dana" ADD CONSTRAINT "penarikan_dana_penyelenggara_id_fkey" FOREIGN KEY ("penyelenggara_id") REFERENCES "penyelenggara"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event" ADD CONSTRAINT "event_penyelenggara_id_fkey" FOREIGN KEY ("penyelenggara_id") REFERENCES "penyelenggara"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kategori_tiket" ADD CONSTRAINT "kategori_tiket_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "paket_bundling" ADD CONSTRAINT "paket_bundling_kategori_tiket_id_fkey" FOREIGN KEY ("kategori_tiket_id") REFERENCES "kategori_tiket"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kode_promo" ADD CONSTRAINT "kode_promo_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pesanan" ADD CONSTRAINT "pesanan_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pesanan" ADD CONSTRAINT "pesanan_pengguna_id_fkey" FOREIGN KEY ("pengguna_id") REFERENCES "pengguna"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pesanan" ADD CONSTRAINT "pesanan_dijual_oleh_fkey" FOREIGN KEY ("dijual_oleh") REFERENCES "pengguna"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pesanan" ADD CONSTRAINT "pesanan_kode_promo_id_fkey" FOREIGN KEY ("kode_promo_id") REFERENCES "kode_promo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_pesanan" ADD CONSTRAINT "item_pesanan_pesanan_id_fkey" FOREIGN KEY ("pesanan_id") REFERENCES "pesanan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_pesanan" ADD CONSTRAINT "item_pesanan_kategori_tiket_id_fkey" FOREIGN KEY ("kategori_tiket_id") REFERENCES "kategori_tiket"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_pesanan" ADD CONSTRAINT "item_pesanan_paket_bundling_id_fkey" FOREIGN KEY ("paket_bundling_id") REFERENCES "paket_bundling"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pembayaran" ADD CONSTRAINT "pembayaran_pesanan_id_fkey" FOREIGN KEY ("pesanan_id") REFERENCES "pesanan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tiket" ADD CONSTRAINT "tiket_item_pesanan_id_fkey" FOREIGN KEY ("item_pesanan_id") REFERENCES "item_pesanan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "validasi_tiket" ADD CONSTRAINT "validasi_tiket_tiket_id_fkey" FOREIGN KEY ("tiket_id") REFERENCES "tiket"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "validasi_tiket" ADD CONSTRAINT "validasi_tiket_dipindai_oleh_fkey" FOREIGN KEY ("dipindai_oleh") REFERENCES "pengguna"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "berita" ADD CONSTRAINT "berita_dibuat_oleh_fkey" FOREIGN KEY ("dibuat_oleh") REFERENCES "pengguna"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
