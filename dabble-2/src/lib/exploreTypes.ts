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
}
