import { Suspense } from "react";
import DashboardLoading from "@/components/layout/dashboard-loading";
import OrganizerShell from "./organizer-shell";

export default function OrganizerDashboardLayout({ children }) {
  return (
    <Suspense fallback={<DashboardLoading label="Memuat panel penyelenggara..." />}>
      <OrganizerShell>{children}</OrganizerShell>
    </Suspense>
  );
}
