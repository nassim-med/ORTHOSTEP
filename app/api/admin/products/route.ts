import { NextResponse } from "next/server";
import { supabaseServer } from "../../../../lib/supabase-server";

export async function GET() {
  const { data, error } = await supabaseServer.from("products").select("*");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(request: Request) {
  const body = await request.json();
  const duplicate = new URL(request.url).searchParams.get("duplicate");
  const payload = { ...body, featured: Boolean(body.featured), created_at: new Date().toISOString() };
  if (duplicate) {
    payload.title = `${payload.title} (Copie)`;
  }
  const { data, error } = await supabaseServer.from("products").insert(payload).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function PUT(request: Request) {
  const searchParams = new URL(request.url).searchParams;
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing product id" }, { status: 400 });
  const body = await request.json();
  const { data, error } = await supabaseServer.from("products").update(body).eq("id", id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(request: Request) {
  const searchParams = new URL(request.url).searchParams;
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing product id" }, { status: 400 });
  const { error } = await supabaseServer.from("products").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
