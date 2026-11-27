import EventWorkspace from "../event-workspace";

export default async function EventPesertaPage({ params }) {
  const { id } = await params;
  return <EventWorkspace eventId={id} tab="peserta" />;
}
