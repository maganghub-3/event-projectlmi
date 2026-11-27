import EventWorkspace from "../event-workspace";

export default async function EventLaporanPage({ params }) {
  const { id } = await params;
  return <EventWorkspace eventId={id} tab="laporan" />;
}
