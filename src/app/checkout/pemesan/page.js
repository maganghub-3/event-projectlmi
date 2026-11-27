import { BRAND } from "@/constants/brand";
import PemesanView from "./pemesan-view";

export const metadata = {
  title: `Detail Pemesan - ${BRAND.name}`,
  description: "Isi identitas pemesan dan peserta sesuai tiket yang dipesan.",
};

export default function DetailPemesanPage() {
  return <PemesanView />;
}
