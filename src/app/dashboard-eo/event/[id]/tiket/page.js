import EventWorkspace from "../event-workspace";

export default async function EventTiketPage({ params }) {
  const { id } = await params;
  return <EventWorkspace eventId={id} tab="tiket" />;
}
