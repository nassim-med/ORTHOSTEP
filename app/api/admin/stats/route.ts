import { NextResponse } from "next/server";
import { supabaseServer } from "../../../../lib/supabase-server";

export async function GET() {
  const [{ data: products }, { data: orders }, { data: views }] = await Promise.all([
    supabaseServer.from("products").select("id").then((res) => res),
    supabaseServer.from("orders").select("id").then((res) => res),
    supabaseServer.from("products").select("title, views").order("views", { ascending: false }).limit(4).then((res) => res)
  ]);

  const [latestOrders] = await Promise.all([
    supabaseServer.from("orders").select("customer, product, created_at").order("created_at", { ascending: false }).limit(5)
  ]);

  return NextResponse.json({
    totalProducts: products?.length ?? 0,
    ordersCount: orders?.length ?? 0,
    whatsappClicks: 0,
    mostViewed: views?.map((item: any) => ({ title: item.title, views: item.views ?? 0 })) ?? [],
    recentActivity: latestOrders?.data?.map((item: any) => `${item.customer} a commandé ${item.product}`) ?? []
  });
}
