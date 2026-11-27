import NewsManager from "@/components/news/news-manager";

export const metadata = {
  title: "Cerita Event - Panel Event Organizer",
};

export default function EOBeritaPage() {
  return <NewsManager role="organizer" basePath="/dashboard-eo/berita" />;
}
