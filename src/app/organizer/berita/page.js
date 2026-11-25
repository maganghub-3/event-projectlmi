import NewsManager from "@/components/news/news-manager";

export const metadata = {
  title: "Kelola Berita - Panel Penyelenggara",
};

export default function OrganizerBeritaPage() {
  return <NewsManager role="organizer" />;
}
