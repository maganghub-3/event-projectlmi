import { Suspense } from "react";
import DashboardLoading from "@/components/layout/dashboard-loading";
import EODashboardShell from "./eo-dashboard-shell";

// usePathname() di shell butuh boundary Suspense saat halaman di-prerender.
export default function EODashboardLayout({ children }) {
  return (
    <Suspense fallback={<DashboardLoading label="Memuat panel EO..." />}>
      <EODashboardShell>{children}</EODashboardShell>
    </Suspense>
  );
}
