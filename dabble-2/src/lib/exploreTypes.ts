export interface DiscoverableProfile {
  id: string;
  username: string;
  display_name: string | null;
  location_label: string | null;
  interests: string[] | null;
  skills: string[] | null;
  lat: number | null;
  lng: number | null;
}
