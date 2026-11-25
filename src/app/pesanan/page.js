import { BRAND } from "@/constants/brand";
import PesananView from "./pesanan-view";

export const metadata = {
  title: `Pesanan & Tiket Saya - ${BRAND.name}`,
  description: "Daftar pesanan dan e-ticket kamu.",
};

export default function PesananPage() {
  return <PesananView />;
}
