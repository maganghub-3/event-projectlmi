import { Suspense } from "react";
import OrganizerProfile from "./organizer-profile";

async function ProfileLoader({ paramsPromise }) {
  const { slug } = await paramsPromise;
  return <OrganizerProfile slug={slug} />;
}

export default function PenyelenggaraPage({ params }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F7F8FC]" />}>
      <ProfileLoader paramsPromise={params} />
    </Suspense>
  );
}
