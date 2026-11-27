export default function DashboardLoading({ label = "Memuat dashboard..." }) {
  return (
    <div className="min-h-screen bg-[#F4F6F9] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-slate-500">
        <span className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-brand-600" />
        <p className="text-xs font-semibold">{label}</p>
      </div>
    </div>
  );
}
