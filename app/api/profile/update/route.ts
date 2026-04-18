import { NextRequest } from "next/server";
import { fail, ok } from "@/src/lib/apiResponses";
import { requireRouteUser } from "@/src/lib/routeAuth";
import { getSupabaseServerClient } from "@/src/lib/supabaseServer";

function toUsernameSeed(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 32);
}

function isMissingColumnError(message: string) {
  const normalized = message.toLowerCase();
  return normalized.includes("column") && normalized.includes("does not exist");
}

export async function POST(request: NextRequest) {
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return fail("Supabase server configuration missing", 500);
  }

  const authResult = await requireRouteUser(request, supabase);
  if (authResult instanceof Response) {
    return authResult;
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

  if (body.userId && body.userId !== authResult.user.id) {
    return fail("Forbidden", 403);
  }
  const userId = authResult.user.id;

  const displayName = body.displayName?.trim() || null;
  const usernameInput = body.username?.trim();
  const candidateUsername = usernameInput
    ? toUsernameSeed(usernameInput)
    : displayName
      ? toUsernameSeed(displayName)
      : `dabbler-${userId.slice(0, 8)}`;
  const username = candidateUsername || `dabbler-${userId.slice(0, 8)}`;

  // Friendly guard before upsert to avoid opaque DB unique violation messages.
  const { data: existingUsername } = await supabase
    .from("profiles")
    .select("id")
    .eq("username", username)
    .neq("id", userId)
    .maybeSingle();
  if (existingUsername?.id) {
    return fail("That username is already in use. Please choose another.", 409);
  }

  const payload = {
    id: userId,
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
    // Some schemas may not include optional fields yet; retry with core columns.
    if (isMissingColumnError(error.message)) {
      const corePayload = {
        id: userId,
        username,
        display_name: displayName,
        interests: Array.isArray(body.interests) ? body.interests : [],
        skills: Array.isArray(body.skills) ? body.skills : [],
      };

      const { data: fallbackData, error: fallbackError } = await supabase
        .from("profiles")
        .upsert(corePayload, { onConflict: "id" })
        .select("id, username, display_name")
        .single();

      if (!fallbackError) {
        return ok({ profile: fallbackData });
      }
    }

    return fail("Failed to update profile", 500, error.message);
  }

  return ok({ profile: data });
}