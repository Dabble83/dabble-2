import type { ProfileRecord } from "@/src/lib/profileTypes";

function offersCount(profile: ProfileRecord): number {
  const o = profile.skills_offered ?? profile.skills;
  return Array.isArray(o) ? o.length : 0;
}

function wantsCount(profile: ProfileRecord): number {
  const w = profile.skills_curious ?? profile.interests;
  return Array.isArray(w) ? w.length : 0;
}

export function missingProfileFields(profile: ProfileRecord | null): string[] {
  if (!profile) return ["display name", "username", "neighborhood", "offers", "wants"];

  const missing: string[] = [];
  if (!profile.display_name?.trim()) missing.push("display name");
  if (!profile.username?.trim()) missing.push("username");
  if (!profile.location_label?.trim()) missing.push("neighborhood");
  if (offersCount(profile) === 0) missing.push("offers");
  if (wantsCount(profile) === 0) missing.push("wants");
  return missing;
}

export function isProfileComplete(profile: ProfileRecord | null): boolean {
  return missingProfileFields(profile).length === 0;
}
