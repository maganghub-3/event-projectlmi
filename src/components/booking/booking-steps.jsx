import Icon from "@/app/landing/Icon";

const STEPS = ["Detail Event", "Kategori Tiket", "Pembayaran", "E-Ticket"];

/**
 * Indikator tahap pemesanan.
 * current: 0 = detail event, 1 = kategori tiket, 2 = pembayaran, 3 = e-ticket.
 */
export default function BookingSteps({ current }) {
  return (
    <ol className="flex flex-wrap items-center gap-2 text-[11px] font-bold">
      {STEPS.map((step, index) => {
        const done = index < current;
        const active = index === current;

        return (
          <li key={step} className="flex items-center gap-2">
            {index > 0 && <span className="text-slate-300">→</span>}
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 ${
                active
                  ? "bg-brand-600 text-white"
                  : done
                    ? "bg-brand-50 text-brand-700"
                    : "bg-slate-200 text-slate-500"
              }`}
            >
              <span
                className={`flex h-4 w-4 items-center justify-center rounded-full text-[9px] ${
                  active
                    ? "bg-white/20"
                    : done
                      ? "bg-brand-600 text-white"
                      : "bg-white text-slate-500"
                }`}
              >
                {done ? <Icon name="check" className="h-2.5 w-2.5" /> : index + 1}
              </span>
              {step}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
