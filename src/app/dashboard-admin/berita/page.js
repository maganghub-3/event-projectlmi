import NewsManager from "@/components/news/news-manager";

export const metadata = {
  title: "Kelola Berita - Panel Super Admin",
};

export default function AdminBeritaPage() {
  return <NewsManager role="super_admin" basePath="/dashboard-admin/berita" />;
}
