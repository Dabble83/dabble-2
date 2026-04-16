import type { ProfileRecord } from "@/src/lib/profileTypes";

export function missingProfileFields(profile: ProfileRecord | null): string[] {
  if (!profile) return ["display name", "username", "neighborhood", "offers", "wants"];

  const missing: string[] = [];
  if (!profile.display_name?.trim()) missing.push("display name");
  if (!profile.username?.trim()) missing.push("username");
  if (!profile.location_label?.trim()) missing.push("neighborhood");
  if (!Array.isArray(profile.skills) || profile.skills.length === 0) missing.push("offers");
  if (!Array.isArray(profile.interests) || profile.interests.length === 0) missing.push("wants");
  return missing;
}

export function isProfileComplete(profile: ProfileRecord | null): boolean {
  return missingProfileFields(profile).length === 0;
}
