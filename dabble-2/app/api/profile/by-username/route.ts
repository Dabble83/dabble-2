import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/src/lib/supabaseServer";

export async function GET(request: NextRequest) {
  const username = request.nextUrl.searchParams.get("username");
  if (!username) {
    return NextResponse.json({ error: "Missing username" }, { status: 400 });
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase server configuration missing" },
      { status: 500 },
    );
  }

  const { data, error } = await supabase
    .from("profiles")
    .select(
      "id, username, display_name, interests_intro, skills_intro, interests, skills, location_label, is_discoverable",
    )
    .eq("username", username)
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      { error: "Failed to load profile", details: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json({ profile: data ?? null });
}
