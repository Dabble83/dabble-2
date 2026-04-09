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

  const primaryQuery = await supabase
    .from("profiles")
    .select("id, username, display_name, location_label, interests, skills, is_discoverable, lat, lng")
    .eq("is_discoverable", true)
    .limit(60);

  let data = primaryQuery.data;
  let error = primaryQuery.error;

  // Fallback for schemas that have no lat/lng columns on profiles.
  if (error && error.message.toLowerCase().includes("does not exist")) {
    const fallbackQuery = await supabase
      .from("profiles")
      .select("id, username, display_name, location_label, interests, skills, is_discoverable")
      .eq("is_discoverable", true)
      .limit(60);

    data = (fallbackQuery.data || []).map((profile) => ({
      ...profile,
      lat: null,
      lng: null,
    }));
    error = fallbackQuery.error;
  }

  // Last-resort fallback for very early schemas without discoverability flag.
  if (error && error.message.toLowerCase().includes("is_discoverable")) {
    const fallbackQuery = await supabase
      .from("profiles")
      .select("id, username, display_name, location_label, interests, skills")
      .limit(60);
    data = (fallbackQuery.data || []).map((profile) => ({
      ...profile,
      is_discoverable: true,
      lat: null,
      lng: null,
    }));
    error = fallbackQuery.error;
  }

  if (error) {
    return NextResponse.json(
      { error: "Failed to load discoverable profiles", details: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json({ profiles: data ?? [] });
}
