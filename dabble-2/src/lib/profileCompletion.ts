import type { ProfileRecord } from "@/src/lib/profileTypes";

export function isProfileComplete(profile: ProfileRecord | null): boolean {
  if (!profile) return false;

  const hasDisplayName = Boolean(profile.display_name?.trim());
  const hasUsername = Boolean(profile.username?.trim());
  const hasLocation = Boolean(profile.location_label?.trim());
  const hasOffers = Array.isArray(profile.skills) && profile.skills.length > 0;
  const hasWants = Array.isArray(profile.interests) && profile.interests.length > 0;

  return hasDisplayName && hasUsername && hasLocation && hasOffers && hasWants;
}
