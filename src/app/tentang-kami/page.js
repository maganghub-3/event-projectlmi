import { BRAND } from "@/constants/brand";
import AboutPage from "./about";

export const metadata = {
  title: `Tentang Kami - ${BRAND.name}`,
  description: `Kenali lebih dekat ${BRAND.name}, platform tiket dan manajemen event resmi di bawah naungan Lembaga Manajemen Infaq (LMI).`,
};

export default function TentangKami() {
  return <AboutPage />;
}
