import AdminShell from "../../../components/admin/AdminShell";
import OrderManager from "../../../components/admin/OrderManager";
import ordersData from "../../../data/orders.json";
import { supabaseServer } from "../../../lib/supabase-server";
import type { OrderRecord } from "../../../types/product";

async function getOrders() {
  try {
    const { data, error } = await supabaseServer.from("orders").select("*").order("created_at", { ascending: false });
    if (error || !data || data.length === 0) return ordersData as OrderRecord[];
    return data as OrderRecord[];
  } catch {
    return ordersData as OrderRecord[];
  }
}

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  return (
    <AdminShell title="Gestion des commandes">
      <OrderManager initial={orders} />
    </AdminShell>
  );
}
