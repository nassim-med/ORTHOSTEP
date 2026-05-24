import { NextResponse } from "next/server";
import { supabaseServer } from "../../../../lib/supabase-server";

export async function GET() {
  const { data, error } = await supabaseServer.from("delivery_zones").select("*");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(request: Request) {
  const payload = await request.json();
  const bulkImport = new URL(request.url).searchParams.get("bulkImport");

  if (bulkImport) {
    const records = (Array.isArray(payload) ? payload : []).map((item) => ({ ...item, enabled: item.enabled !== false }));
    const { data, error } = await supabaseServer.from("delivery_zones").insert(records).select();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data ?? []);
  }

  const record = { ...payload, enabled: payload.enabled !== false };
  const { data, error } = await supabaseServer.from("delivery_zones").insert(record).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function PUT(request: Request) {
  const searchParams = new URL(request.url).searchParams;
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing zone id" }, { status: 400 });
  const body = await request.json();
  const { data, error } = await supabaseServer.from("delivery_zones").update(body).eq("id", id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(request: Request) {
  const searchParams = new URL(request.url).searchParams;
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing zone id" }, { status: 400 });
  const { error } = await supabaseServer.from("delivery_zones").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
