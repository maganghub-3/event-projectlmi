import { Suspense } from "react";
import DashboardLoading from "@/components/layout/dashboard-loading";
import AdminDashboardShell from "./admin-dashboard-shell";

export default function AdminDashboardLayout({ children }) {
  return (
    <Suspense fallback={<DashboardLoading label="Memuat panel admin..." />}>
      <AdminDashboardShell>{children}</AdminDashboardShell>
    </Suspense>
  );
}
