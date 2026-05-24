import AdminShell from "../../../components/admin/AdminShell";

export default function AdminSetupPage() {
  return (
    <AdminShell title="Initial setup">
      <div className="grid gap-6 rounded-[32px] border border-slate-200 bg-white p-6 shadow-soft md:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.24em] text-orthostep-dark/70">Production onboarding</p>
          <h2 className="text-3xl font-semibold text-slate-900">Complete the ORTHOSTEP setup</h2>
          <p className="text-sm leading-7 text-slate-600">
            Use this route to confirm your production checklist, verify store settings,
            and jump to the main admin areas before launch.
          </p>
        </div>
        <div className="rounded-[28px] bg-slate-50 p-5">
          <ul className="space-y-3 text-sm text-slate-700">
            <li>1. Verify Supabase env variables are set in Vercel.</li>
            <li>2. Configure store settings, socials, and WhatsApp number.</li>
            <li>3. Add products and delivery zones.</li>
            <li>4. Open the dashboard to confirm live data.</li>
          </ul>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="/admin/settings" className="rounded-full bg-orthostep px-5 py-3 text-sm font-semibold text-white shadow-lg hover:bg-orthostep-dark">
              Open settings
            </a>
            <a href="/admin/dashboard" className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50">
              Go to dashboard
            </a>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
