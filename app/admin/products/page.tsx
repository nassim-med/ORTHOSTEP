import AdminShell from "../../../components/admin/AdminShell";
import ProductManager from "../../../components/admin/ProductManager";
import type { Product } from "../../../types/product";
import productsData from "../../../data/products.json";
import { supabaseServer } from "../../../lib/supabase-server";

const initialProducts = productsData as Product[];

async function getProducts() {
  try {
    const { data, error } = await supabaseServer.from("products").select("*").order("created_at", { ascending: false });
    if (error || !data || data.length === 0) return initialProducts;
    return data as Product[];
  } catch {
    return initialProducts;
  }
}

export default async function AdminProductsPage() {
  const products = await getProducts();

  return (
    <AdminShell title="Catalogue des produits">
      <ProductManager initial={products} />
    </AdminShell>
  );
}
