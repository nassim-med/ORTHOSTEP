"use client";

import { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";
import type { DeliveryZone } from "../../types/product";
import deliveryZonesSeed from "../../data/algeria-delivery.json";

interface DeliveryManagerProps {
  initial: DeliveryZone[];
}

export default function DeliveryManager({ initial }: DeliveryManagerProps) {
  const [zones, setZones] = useState<DeliveryZone[]>(initial);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<DeliveryZone | null>(null);
  const [formState, setFormState] = useState<DeliveryZone>({ wilaya: "", commune: "", price: 0, days: "", enabled: true });

  useEffect(() => {
    setZones(initial);
  }, [initial]);

  const filtered = zones.filter((zone) => {
    const term = query.toLowerCase();
    return zone.wilaya.toLowerCase().includes(term) || zone.commune.toLowerCase().includes(term);
  });

  const openEditor = (zone?: DeliveryZone) => {
    if (zone) {
      setEditing(zone);
      setFormState(zone);
    } else {
      setEditing(null);
      setFormState({ wilaya: "", commune: "", price: 0, days: "", enabled: true });
    }
  };

  const saveZone = async () => {
    const method = editing ? "PUT" : "POST";
    const response = await fetch(`/api/admin/delivery${editing ? `?id=${editing.id}` : ""}`, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formState)
    });
    if (!response.ok) return;
    const data = await response.json();
    setZones((prev) => {
      if (editing) return prev.map((zone) => (zone.id === data.id ? data : zone));
      return [data, ...prev];
    });
    openEditor();
  };

  const toggleZone = async (zone: DeliveryZone) => {
    const response = await fetch(`/api/admin/delivery?id=${zone.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...zone, enabled: !zone.enabled })
    });
    if (!response.ok) return;
    const data = await response.json();
    setZones((prev) => prev.map((item) => (item.id === data.id ? data : item)));
  };

  const deleteZone = async (zone: DeliveryZone) => {
    if (!zone.id) return;
    if (!confirm("Supprimer cette zone ?")) return;
    const response = await fetch(`/api/admin/delivery?id=${zone.id}`, { method: "DELETE" });
    if (!response.ok) return;
    setZones((prev) => prev.filter((item) => item.id !== zone.id));
  };

  const bulkImportZones = async () => {
    const existing = new Set(zones.map((zone) => `${zone.wilaya}::${zone.commune}`.toLowerCase()));
    const payload = deliveryZonesSeed.filter((zone) => !existing.has(`${zone.wilaya}::${zone.commune}`.toLowerCase()));
    if (payload.length === 0) return;

    const response = await fetch("/api/admin/delivery?bulkImport=true", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) return;
    const data = await response.json();
    if (Array.isArray(data)) {
      setZones((prev) => [...data, ...prev]);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Base de livraison Algérie</h2>
          <p className="text-sm text-slate-600">Gérez les wilayas, communes, tarifs et délais de livraison.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={bulkImportZones} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50">
            Import Algerie
          </button>
          <button type="button" onClick={() => openEditor()} className="inline-flex items-center gap-2 rounded-full bg-orthostep px-5 py-3 text-sm font-semibold text-white shadow-lg hover:bg-orthostep-dark">
            <Plus size={16} /> Nouvelle zone
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Rechercher wilaya ou commune" className="w-full rounded-full border border-slate-200 bg-white px-12 py-3 text-sm outline-none focus:border-orthostep" />
        </div>
      </div>
      <div className="grid gap-4">
        {filtered.map((zone, index) => (
          <div key={zone.id ?? `${zone.wilaya}-${zone.commune}-${index}`} className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-soft">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-lg font-semibold text-slate-900">{zone.wilaya} — {zone.commune}</p>
                <p className="mt-2 text-sm text-slate-600">{zone.price.toLocaleString("fr-FR")} DZD • {zone.days}</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button type="button" onClick={() => openEditor(zone)} className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-100">Modifier</button>
                <button type="button" onClick={() => toggleZone(zone)} className={`rounded-full px-4 py-2 text-sm font-semibold ${zone.enabled ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
                  {zone.enabled ? "Activé" : "Désactivé"}
                </button>
                <button type="button" onClick={() => deleteZone(zone)} className="rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-100">Supprimer</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {formState ? (
        <div className="rounded-[32px] border border-slate-200 bg-slate-50 p-6">
          <h3 className="text-xl font-semibold">{editing ? "Modifier la zone" : "Nouvelle zone de livraison"}</h3>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm text-slate-700">
              Wilaya
              <input value={formState.wilaya} onChange={(event) => setFormState({ ...formState, wilaya: event.target.value })} className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-orthostep" />
            </label>
            <label className="space-y-2 text-sm text-slate-700">
              Commune
              <input value={formState.commune} onChange={(event) => setFormState({ ...formState, commune: event.target.value })} className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-orthostep" />
            </label>
            <label className="space-y-2 text-sm text-slate-700">
              Prix de livraison
              <input type="number" value={formState.price} onChange={(event) => setFormState({ ...formState, price: Number(event.target.value) })} className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-orthostep" />
            </label>
            <label className="space-y-2 text-sm text-slate-700">
              Délais
              <input value={formState.days} onChange={(event) => setFormState({ ...formState, days: event.target.value })} className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-orthostep" placeholder="1–2 days" />
            </label>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <button type="button" onClick={saveZone} className="rounded-full bg-orthostep px-6 py-3 text-sm font-semibold text-white shadow-lg hover:bg-orthostep-dark">Enregistrer la zone</button>
            <button type="button" onClick={() => openEditor()} className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50">Réinitialiser</button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
