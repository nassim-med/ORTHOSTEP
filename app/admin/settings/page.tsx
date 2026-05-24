import AdminShell from "../../../components/admin/AdminShell";
import SettingsManager from "../../../components/admin/SettingsManager";
import { supabaseServer } from "../../../lib/supabase-server";
import { defaultStoreSettings } from "../../../lib/store-settings";

async function getSettings() {
  try {
    const { data, error } = await supabaseServer
      .from("store_settings")
      .select("*")
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) return defaultStoreSettings;
    return { ...defaultStoreSettings, ...(data || {}) };
  } catch {
    return defaultStoreSettings;
  }
}

export default async function AdminSettingsPage() {
  const settings = await getSettings();

  return (
    <AdminShell title="Store settings">
      <SettingsManager initial={settings} />
    </AdminShell>
  );
}
