import { NextRequest, NextResponse } from "next/server";
import type { ProfileRecord } from "@/src/lib/profileTypes";
import { isProfileComplete } from "@/src/lib/profileCompletion";
import { getSupabaseServerClient } from "@/src/lib/supabaseServer";

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
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
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      { error: "Failed to check profile", details: error.message },
      { status: 500 },
    );
  }

  const profile = (data ?? null) as ProfileRecord | null;
  return NextResponse.json({
    complete: isProfileComplete(profile),
    username: profile?.username ?? null,
  });
}
