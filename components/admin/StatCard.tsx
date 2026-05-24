interface StatCardProps {
  label: string;
  value: string | number;
  accent?: string;
}

export default function StatCard({ label, value, accent }: StatCardProps) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-soft">
      <p className="text-sm uppercase tracking-[0.24em] text-slate-500">{label}</p>
      <p className={`mt-4 text-3xl font-semibold ${accent ?? "text-slate-900"}`}>{value}</p>
    </div>
  );
}
