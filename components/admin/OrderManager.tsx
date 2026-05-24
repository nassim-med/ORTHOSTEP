"use client";

import { useEffect, useState } from "react";
import { RefreshCcw } from "lucide-react";
import type { OrderRecord } from "../../types/product";

interface OrderManagerProps {
  initial: OrderRecord[];
}

const statuses = ["New", "Confirmed", "Shipped", "Delivered", "Cancelled"] as const;

export default function OrderManager({ initial }: OrderManagerProps) {
  const [orders, setOrders] = useState<OrderRecord[]>(initial);

  const formatDate = (value: string) => {
    if (!value) return "";
    return value.split("T")[0];
  };

  useEffect(() => {
    setOrders(initial);
  }, [initial]);

  const refreshOrders = async () => {
    const response = await fetch("/api/admin/orders", { cache: "no-store" });
    if (!response.ok) return;
    setOrders(await response.json());
  };

  const updateStatus = async (id: string, status: typeof statuses[number]) => {
    const response = await fetch(`/api/admin/orders?id=${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
    if (!response.ok) return;
    const updated = await response.json();
    setOrders((prev) => prev.map((order) => (order.id === updated.id ? updated : order)));
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold">Commandes WhatsApp</h2>
        <p className="mt-2 text-sm text-slate-600">Suivez les commandes client, mettez à jour le statut et consultez l’historique.</p>
      </div>
      <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-soft overflow-x-auto">
        <table className="min-w-full text-left text-sm text-slate-700">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500">
              <th className="px-4 py-3">Client</th>
              <th className="px-4 py-3">Téléphone</th>
              <th className="px-4 py-3">Produit</th>
              <th className="px-4 py-3">Wilaya</th>
              <th className="px-4 py-3">Commune</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-slate-50">
                <td className="px-4 py-4 font-semibold text-slate-900">{order.customer}</td>
                <td className="px-4 py-4">{order.phone}</td>
                <td className="px-4 py-4">{order.product}</td>
                <td className="px-4 py-4">{order.wilaya}</td>
                <td className="px-4 py-4">{order.commune}</td>
                <td className="px-4 py-4">
                  <select value={order.status} onChange={(event) => updateStatus(order.id, event.target.value as typeof statuses[number])} className="rounded-3xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none">
                    {statuses.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-4">{formatDate(order.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button type="button" onClick={refreshOrders} className="inline-flex items-center gap-2 rounded-full bg-orthostep px-5 py-3 text-sm font-semibold text-white hover:bg-orthostep-dark">
        <RefreshCcw size={16} /> Actualiser
      </button>
    </div>
  );
}
