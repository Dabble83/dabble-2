export interface ProfileRecord {
  id: string;
  username: string;
  display_name: string | null;
  interests_intro: string | null;
  skills_intro: string | null;
  interests: string[] | null;
  skills: string[] | null;
  location_label: string | null;
  is_discoverable: boolean | null;
}