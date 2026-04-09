import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) return null;
  return createClient(url, serviceRoleKey);
}

function toUsernameSeed(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 32);
}

export async function POST(request: NextRequest) {
  const supabase = getServerClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase server configuration missing" },
      { status: 500 },
    );
  }

  const body = (await request.json()) as {
    userId?: string;
    displayName?: string;
    username?: string;
    interestsIntro?: string;
    skillsIntro?: string;
    interests?: string[];
    skills?: string[];
    locationLabel?: string;
    isDiscoverable?: boolean;
  };

  if (!body.userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  const displayName = body.displayName?.trim() || null;
  const username =
    body.username?.trim() ||
    (displayName ? toUsernameSeed(displayName) : `dabbler-${body.userId.slice(0, 8)}`);

  const payload = {
    id: body.userId,
    username,
    display_name: displayName,
    interests_intro: body.interestsIntro ?? null,
    skills_intro: body.skillsIntro ?? null,
    interests: Array.isArray(body.interests) ? body.interests : [],
    skills: Array.isArray(body.skills) ? body.skills : [],
    location_label: body.locationLabel ?? null,
    is_discoverable: body.isDiscoverable ?? false,
  };

  const { data, error } = await supabase
    .from("profiles")
    .upsert(payload, { onConflict: "id" })
    .select("id, username, display_name")
    .single();

  if (error) {
    return NextResponse.json(
      { error: "Failed to update profile", details: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json({ profile: data });
}
