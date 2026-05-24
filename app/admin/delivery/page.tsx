import AdminShell from "../../../components/admin/AdminShell";
import DeliveryManager from "../../../components/admin/DeliveryManager";
import { supabaseServer } from "../../../lib/supabase-server";
import deliveryZones from "../../../data/algeria-delivery.json";
import type { DeliveryZone } from "../../../types/product";

async function getZones() {
  try {
    const { data, error } = await supabaseServer.from("delivery_zones").select("*");
    if (error || !data || data.length === 0) return deliveryZones as DeliveryZone[];
    return data as DeliveryZone[];
  } catch {
    return deliveryZones as DeliveryZone[];
  }
}

export default async function AdminDeliveryPage() {
  const zones = await getZones();

  return (
    <AdminShell title="Gestion de la livraison">
      <DeliveryManager initial={zones} />
    </AdminShell>
  );
}
