"use client";

import { FormEvent, useState } from "react";
import type { StoreSettings } from "../../types/product";
import {
  defaultStoreSettings,
  SETTINGS_EVENT,
  SETTINGS_STORAGE_KEY,
  safeUrl
} from "../../lib/store-settings";

type TabKey = "general" | "social" | "contact" | "branding";

interface SettingsManagerProps {
  initial: StoreSettings;
}

const tabs: { key: TabKey; label: string }[] = [
  { key: "general", label: "General" },
  { key: "social", label: "Social" },
  { key: "contact", label: "Contact" },
  { key: "branding", label: "Branding" }
];

export default function SettingsManager({ initial }: SettingsManagerProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("general");
  const [formState, setFormState] = useState<StoreSettings>({ ...defaultStoreSettings, ...initial });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");

  const updateField = <K extends keyof StoreSettings>(key: K, value: StoreSettings[K]) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
  };

  const saveSettings = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);

    const payload: StoreSettings = {
      ...formState,
      facebook: safeUrl(formState.facebook),
      instagram: safeUrl(formState.instagram),
      tiktok: safeUrl(formState.tiktok),
      telegram: safeUrl(formState.telegram)
    };

    const response = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    setSaving(false);
    if (!response.ok) return;

    const data = (await response.json()) as StoreSettings;
    setFormState((prev) => ({ ...prev, ...data }));
    setToast("Settings updated successfully");
    window.localStorage.setItem(SETTINGS_STORAGE_KEY, String(Date.now()));
    window.dispatchEvent(new Event(SETTINGS_EVENT));
    window.setTimeout(() => setToast(""), 2600);
  };

  return (
    <form onSubmit={saveSettings} className="space-y-6 rounded-[32px] border border-slate-200 bg-white p-6 shadow-soft">
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              activeTab === tab.key ? "bg-orthostep text-white" : "border border-slate-200 bg-slate-50 text-slate-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "general" ? (
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm text-slate-700">
            Store name
            <input value={formState.store_name || ""} onChange={(event) => updateField("store_name", event.target.value)} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-orthostep" />
          </label>
          <label className="space-y-2 text-sm text-slate-700">
            Location
            <input value={formState.location || ""} onChange={(event) => updateField("location", event.target.value)} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-orthostep" />
          </label>
          <label className="space-y-2 text-sm text-slate-700 md:col-span-2">
            Store description
            <textarea value={formState.description || ""} onChange={(event) => updateField("description", event.target.value)} className="min-h-[120px] w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-orthostep" />
          </label>
        </div>
      ) : null}

      {activeTab === "social" ? (
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm text-slate-700">
            WhatsApp URL / Number
            <input value={formState.whatsapp || ""} onChange={(event) => updateField("whatsapp", event.target.value)} placeholder="+213556800701 or https://wa.me/..." className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-orthostep" />
          </label>
          <label className="space-y-2 text-sm text-slate-700">
            Facebook URL
            <input value={formState.facebook || ""} onChange={(event) => updateField("facebook", event.target.value)} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-orthostep" />
          </label>
          <label className="space-y-2 text-sm text-slate-700">
            Instagram URL
            <input value={formState.instagram || ""} onChange={(event) => updateField("instagram", event.target.value)} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-orthostep" />
          </label>
          <label className="space-y-2 text-sm text-slate-700">
            TikTok URL
            <input value={formState.tiktok || ""} onChange={(event) => updateField("tiktok", event.target.value)} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-orthostep" />
          </label>
          <label className="space-y-2 text-sm text-slate-700 md:col-span-2">
            Telegram URL (optional)
            <input value={formState.telegram || ""} onChange={(event) => updateField("telegram", event.target.value)} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-orthostep" />
          </label>
        </div>
      ) : null}

      {activeTab === "contact" ? (
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm text-slate-700">
            Support email
            <input type="email" value={formState.support_email || ""} onChange={(event) => updateField("support_email", event.target.value)} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-orthostep" />
          </label>
          <label className="space-y-2 text-sm text-slate-700">
            Opening hours
            <input value={formState.opening_hours || ""} onChange={(event) => updateField("opening_hours", event.target.value)} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-orthostep" />
          </label>
        </div>
      ) : null}

      {activeTab === "branding" ? (
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm text-slate-700 md:col-span-2">
            Store logo URL
            <input value={formState.logo || ""} onChange={(event) => updateField("logo", event.target.value)} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-orthostep" />
          </label>
          {formState.logo ? (
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 md:col-span-2">
              <p className="text-sm text-slate-500">Logo preview</p>
              <img src={formState.logo} alt="Store logo" className="mt-3 h-16 w-auto rounded-lg object-contain" />
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="flex items-center justify-between gap-4">
        <button type="submit" disabled={saving} className="inline-flex items-center justify-center rounded-full bg-orthostep px-6 py-3 text-sm font-semibold text-white shadow-lg hover:bg-orthostep-dark">
          {saving ? "Saving..." : "Save settings"}
        </button>
        {toast ? <p className="text-sm font-semibold text-emerald-600">{toast}</p> : null}
      </div>
    </form>
  );
}
