-- CreateTable
CREATE TABLE "refresh_token" (
    "id" SERIAL NOT NULL,
    "pengguna_id" INTEGER NOT NULL,
    "keluarga_id" VARCHAR(36) NOT NULL,
    "token_hash" VARCHAR(64) NOT NULL,
    "generasi" INTEGER NOT NULL DEFAULT 0,
    "kedaluwarsa_pada" TIMESTAMP(3) NOT NULL,
    "dibuat_pada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "digunakan_pada" TIMESTAMP(3),
    "dicabut_pada" TIMESTAMP(3),
    "alamat_ip" VARCHAR(45),
    "agen_pengguna" VARCHAR(255),

    CONSTRAINT "refresh_token_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "refresh_token_token_hash_key" ON "refresh_token"("token_hash");

-- CreateIndex
CREATE INDEX "refresh_token_pengguna_id_idx" ON "refresh_token"("pengguna_id");

-- CreateIndex
CREATE INDEX "refresh_token_keluarga_id_idx" ON "refresh_token"("keluarga_id");

-- CreateIndex
CREATE INDEX "refresh_token_kedaluwarsa_pada_idx" ON "refresh_token"("kedaluwarsa_pada");

-- Enforce one-to-one Pengguna <-> Penyelenggara
CREATE UNIQUE INDEX "pengguna_penyelenggara_id_key" ON "pengguna"("penyelenggara_id");

-- AddForeignKey
ALTER TABLE "refresh_token" ADD CONSTRAINT "refresh_token_pengguna_id_fkey" FOREIGN KEY ("pengguna_id") REFERENCES "pengguna"("id") ON DELETE CASCADE ON UPDATE CASCADE;
