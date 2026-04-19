export type ExploreCategoryId = "outdoor" | "diy" | "craft" | "food" | "music";

export interface DiscoverableProfile {
  id: string;
  username: string;
  display_name: string | null;
  location_label: string | null;
  interests: string[] | null;
  skills: string[] | null;
  lat: number | null;
  lng: number | null;
  is_discoverable?: boolean | null;
  show_exact_location?: boolean | null;
  travel_radius_km?: number | null;
  skills_offered?: string[] | null;
  skills_curious?: string[] | null;
  /** When set on DB, overrides inference from offers (§2.3 / P1.4). */
  primary_category?: ExploreCategoryId | string | null;
  teaching_now?: boolean | null;
  availability_note?: string | null;
}
