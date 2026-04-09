import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) return null;
  return createClient(url, serviceRoleKey);
}

export async function GET() {
  const supabase = getServerClient();
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
