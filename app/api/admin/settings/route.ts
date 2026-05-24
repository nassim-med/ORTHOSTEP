import { NextResponse } from "next/server";
import { supabaseServer } from "../../../../lib/supabase-server";
import { defaultStoreSettings } from "../../../../lib/store-settings";

export async function GET() {
  const { data, error } = await supabaseServer
    .from("store_settings")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ...defaultStoreSettings, ...(data || {}) });
}

export async function PUT(request: Request) {
  const payload = await request.json();

  const { data: existing, error: findError } = await supabaseServer
    .from("store_settings")
    .select("id")
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (findError) return NextResponse.json({ error: findError.message }, { status: 500 });

  const nextPayload = { ...payload, updated_at: new Date().toISOString() };

  if (existing?.id) {
    const { data, error } = await supabaseServer
      .from("store_settings")
      .update(nextPayload)
      .eq("id", existing.id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  }

  const { data, error } = await supabaseServer
    .from("store_settings")
    .insert({ ...defaultStoreSettings, ...nextPayload })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
