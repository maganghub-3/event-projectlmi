import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.ts";
import { hashPassword } from "../src/lib/auth.js";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

const SUPER_ADMIN = {
  nama: "superadmin",
  email: "superadmin@gmail.com",
  password: "123",
};

async function main() {
  const existing = await prisma.pengguna.findUnique({
    where: { email: SUPER_ADMIN.email },
  });

  if (existing) {
    await prisma.pengguna.update({
      where: { email: SUPER_ADMIN.email },
      data: {
        nama: SUPER_ADMIN.nama,
        kataSandiHash: hashPassword(SUPER_ADMIN.password),
        peran: "SUPER_ADMIN",
        status: "AKTIF",
      },
    });
    console.log(`SUPER_ADMIN diperbarui: ${SUPER_ADMIN.email}`);
    return;
  }

  const user = await prisma.pengguna.create({
    data: {
      nama: SUPER_ADMIN.nama,
      email: SUPER_ADMIN.email,
      kataSandiHash: hashPassword(SUPER_ADMIN.password),
      peran: "SUPER_ADMIN",
      status: "AKTIF",
    },
  });
  console.log(`SUPER_ADMIN dibuat: ${user.email}`);
}

main()
  .catch((err) => {
    console.error("Gagal menjalankan seeder:", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
