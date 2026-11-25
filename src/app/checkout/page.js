import { BRAND } from "@/constants/brand";
import CheckoutView from "./checkout-view";

export const metadata = {
  title: `Checkout Tiket - ${BRAND.name}`,
  description: "Ringkasan pesanan, data pembeli, dan pembayaran tiket event.",
};

export default function CheckoutPage() {
  return <CheckoutView />;
}
