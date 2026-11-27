import { Suspense } from "react";
import NewsEditor from "@/components/news/news-editor";

export const metadata = {
  title: "Tulis Berita - Panel Super Admin",
};

export default function AdminTulisBeritaPage() {
  return (
    <Suspense fallback={<p className="text-sm text-slate-500">Memuat editor berita...</p>}>
      <NewsEditor role="super_admin" basePath="/dashboard-admin/berita" />
    </Suspense>
  );
}
