import { Suspense } from "react";
import NewsEditor from "@/components/news/news-editor";

export const metadata = {
  title: "Tulis Cerita Event - Panel Event Organizer",
};

export default function EOTulisBeritaPage() {
  return (
    <Suspense fallback={<p className="text-sm text-slate-500">Memuat editor...</p>}>
      <NewsEditor role="organizer" basePath="/dashboard-eo/berita" />
    </Suspense>
  );
}
