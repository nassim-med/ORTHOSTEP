import { NextResponse } from "next/server";
import { supabaseServer } from "../../../lib/supabase-server";
import { defaultStoreSettings } from "../../../lib/store-settings";

export async function GET() {
  const { data, error } = await supabaseServer
    .from("store_settings")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    return NextResponse.json(defaultStoreSettings);
  }

  return NextResponse.json({ ...defaultStoreSettings, ...(data || {}) });
}
