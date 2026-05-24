"use client";

import { useEffect, useState } from "react";
import AdminShell from "../../../components/admin/AdminShell";
import StatCard from "../../../components/admin/StatCard";

interface Stats {
  totalProducts: number;
  ordersCount: number;
  whatsappClicks: number;
  mostViewed: { title: string; views: number }[];
  recentActivity: string[];
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    const load = async () => {
      const response = await fetch("/api/admin/stats");
      if (!response.ok) return;
      setStats(await response.json());
    };
    load();
  }, []);

  return (
    <AdminShell title="Tableau de bord">
      <div className="space-y-10">
        <div className="grid gap-6 md:grid-cols-3">
          <StatCard label="Total produits" value={stats?.totalProducts ?? "..."} />
          <StatCard label="Commandes" value={stats?.ordersCount ?? "..."} />
          <StatCard label="Clics WhatsApp" value={stats?.whatsappClicks ?? "..."} />
        </div>
        <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
          <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-soft">
            <h2 className="text-xl font-semibold text-slate-900">Produits les plus vus</h2>
            <div className="mt-6 space-y-4">
              {stats?.mostViewed.map((item) => (
                <div key={item.title} className="flex items-center justify-between rounded-3xl bg-slate-50 px-4 py-4">
                  <span className="font-semibold text-slate-900">{item.title}</span>
                  <span className="rounded-full bg-orthostep-light px-3 py-1 text-sm font-semibold text-orthostep-dark">{item.views} vues</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-soft">
            <h2 className="text-xl font-semibold text-slate-900">Activité récente</h2>
            <ul className="mt-6 space-y-3 text-sm text-slate-600">
              {stats?.recentActivity.map((item, index) => (
                <li key={index} className="rounded-3xl bg-slate-50 px-4 py-3">{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
