import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/src/lib/supabaseServer";

export async function GET() {
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase server configuration missing" },
      { status: 500 },
    );
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("id, username, display_name, location_label, interests, skills, is_discoverable, lat, lng")
    .eq("is_discoverable", true)
    .limit(60);

  if (error) {
    return NextResponse.json(
      { error: "Failed to load discoverable profiles", details: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json({ profiles: data ?? [] });
}
