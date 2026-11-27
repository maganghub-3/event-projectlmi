import EventWorkspace from "../event-workspace";

export default async function EventInfoPage({ params }) {
  const { id } = await params;
  return <EventWorkspace eventId={id} tab="info" />;
}
