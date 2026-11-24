-- DropForeignKey
ALTER TABLE "refresh_token" DROP CONSTRAINT "refresh_token_pengguna_id_fkey";

-- DropTable
DROP TABLE "refresh_token";
