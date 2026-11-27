import { z } from "zod";

export const PAYMENT_METHOD_IDS = ["qris", "va-bca", "ewallet"];

export const checkoutSchema = z.object({
  paymentMethod: z.enum(PAYMENT_METHOD_IDS, {
    message: "Pilih satu metode pembayaran.",
  }),
});
