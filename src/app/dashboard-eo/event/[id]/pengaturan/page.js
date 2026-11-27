import EventWorkspace from "../event-workspace";

export default async function EventPengaturanPage({ params }) {
  const { id } = await params;
  return <EventWorkspace eventId={id} tab="pengaturan" />;
}
