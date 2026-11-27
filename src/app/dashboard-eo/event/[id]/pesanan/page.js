import EventWorkspace from "../event-workspace";

export default async function EventPesananPage({ params }) {
  const { id } = await params;
  return <EventWorkspace eventId={id} tab="pesanan" />;
}
