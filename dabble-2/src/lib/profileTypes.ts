/** Profile row shape returned by `/api/profile/*` after normalization (RFC 001 + legacy fields). */
export interface ProfileRecord {
  id: string;
  username: string;
  display_name: string | null;
  bio?: string | null;
  interests_intro: string | null;
  skills_intro: string | null;
  /** Legacy mirror of skills_curious until DB drops `interests`. */
  interests: string[] | null;
  /** Legacy mirror of skills_offered until DB drops `skills`. */
  skills: string[] | null;
  skills_offered?: string[] | null;
  skills_curious?: string[] | null;
  experience_note?: string | null;
  /** Owner-only in API responses; omitted on public profile JSON. */
  credit_balance?: number;
  location_label: string | null;
  is_discoverable: boolean | null;
  show_exact_location?: boolean | null;
  travel_radius_km?: number | null;
  /** Owner-only when omitted from public JSON. */
  availability_note?: string | null;
  safety_tier_consent?: number | null;
  lat?: number | null;
  lng?: number | null;
  avatar_url?: string | null;
}
