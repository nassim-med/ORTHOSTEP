import { NextResponse } from "next/server";
import { supabaseServer } from "../../../../lib/supabase-server";

export async function GET() {
  const { data, error } = await supabaseServer.from("orders").select("*").order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function PUT(request: Request) {
  const searchParams = new URL(request.url).searchParams;
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing order id" }, { status: 400 });
  const body = await request.json();
  const { data, error } = await supabaseServer.from("orders").update(body).eq("id", id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const payload = await request.json();
  const record = { ...payload, status: "New", created_at: new Date().toISOString() };
  const { data, error } = await supabaseServer.from("orders").insert(record).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
