import { BRAND } from "@/constants/brand";
import HubungiKamiPage from "./hubungi-kami-page";

export const metadata = {
  title: `Hubungi Kami - ${BRAND.name}`,
  description:
    "Hubungi tim LMI Event untuk pertanyaan tiket, kendala pembayaran, kerja sama, atau rencana menyelenggarakan event.",
};

export default function HubungiKami() {
  return <HubungiKamiPage />;
}
