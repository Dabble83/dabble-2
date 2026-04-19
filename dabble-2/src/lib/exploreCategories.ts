/**
 * §2.3 map motifs — category pin colors (Explore / Google Maps markers).
 * P1.4: filter + map visual alignment.
 */
import type { DiscoverableProfile, ExploreCategoryId } from "@/src/lib/exploreTypes";

export const EXPLORE_CATEGORY_IDS: ExploreCategoryId[] = ["outdoor", "diy", "craft", "food", "music"];

export const EXPLORE_CATEGORIES: {
  id: ExploreCategoryId;
  label: string;
  /** Pin / chip fill (§2.3 names) */
  pinHex: string;
}[] = [
  { id: "outdoor", label: "Outdoor", pinHex: "#6d8570" }, // sage
  { id: "diy", label: "DIY", pinHex: "#c4a574" }, // clay
  { id: "craft", label: "Craft", pinHex: "#c4785a" }, // ember
  { id: "food", label: "Food", pinHex: "#5c7a56" }, // forest
  { id: "music", label: "Music", pinHex: "#3d4a5c" }, // ink
];

const KEYWORD_RULES: { id: ExploreCategoryId; patterns: RegExp[] }[] = [
  {
    id: "music",
    patterns: [/music|guitar|piano|drum|sing|song|band|violin|audio/i],
  },
  {
    id: "food",
    patterns: [/cook|bake|bread|sourdough|kitchen|recipe|meal|ferment|chef/i],
  },
  {
    id: "diy",
    patterns: [/repair|wood|drywall|tool|electric|plumb|bike\s*tune|home\s*fix|saw|drill/i],
  },
  {
    id: "craft",
    patterns: [/knit|sew|weave|pottery|clay|print|letterpress|quilt|embroid/i],
  },
  {
    id: "outdoor",
    patterns: [/hike|kayak|camp|garden|plant|trail|ski|paddle|outdoor|fly\s*cast/i],
  },
];

/** Infer primary teaching category from offer tags (until `primary_category` is stored on profile). */
export function inferPrimaryCategory(offers: string[]): ExploreCategoryId {
  const blob = offers.join(" ").toLowerCase();
  if (!blob.trim()) return "outdoor";
  for (const rule of KEYWORD_RULES) {
    if (rule.patterns.some((re) => re.test(blob))) return rule.id;
  }
  return "outdoor";
}

export function pinColorForCategory(id: ExploreCategoryId): string {
  return EXPLORE_CATEGORIES.find((c) => c.id === id)?.pinHex ?? "#6d8570";
}

/** Heuristic until `teaching_now` exists on profiles — availability note signals openness soon. */
export function inferTeachingNow(availabilityNote: string | null | undefined): boolean {
  if (!availabilityNote?.trim()) return false;
  return /(\bnow\b|today|tonight|this\s+afternoon|this\s+evening|free\s+this\s+week)/i.test(availabilityNote);
}

export function haversineKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

export function enrichDiscoverableProfile(p: DiscoverableProfile): DiscoverableProfile {
  const offers = p.skills_offered ?? p.skills ?? [];
  const stored = p.primary_category;
  const primary: ExploreCategoryId =
    stored && EXPLORE_CATEGORY_IDS.includes(stored as ExploreCategoryId)
      ? (stored as ExploreCategoryId)
      : inferPrimaryCategory(Array.isArray(offers) ? offers : []);
  const teaching =
    typeof p.teaching_now === "boolean" ? p.teaching_now : inferTeachingNow(p.availability_note);
  return {
    ...p,
    primary_category: primary,
    teaching_now: teaching,
  };
}

export function filterDiscoverableProfiles(
  profiles: DiscoverableProfile[],
  opts: {
    categories: ExploreCategoryId[];
    maxKm: number | null;
    origin: { lat: number; lng: number } | null;
    teachingOnly: boolean;
  },
): DiscoverableProfile[] {
  let out = profiles.map(enrichDiscoverableProfile);

  if (opts.categories.length > 0) {
    out = out.filter((p) => opts.categories.includes(p.primary_category as ExploreCategoryId));
  }

  if (opts.teachingOnly) {
    out = out.filter((p) => p.teaching_now === true);
  }

  if (opts.maxKm != null && opts.origin && Number.isFinite(opts.maxKm)) {
    const { lat, lng } = opts.origin;
    out = out.filter((p) => {
      if (typeof p.lat !== "number" || typeof p.lng !== "number") return false;
      return haversineKm({ lat, lng }, { lat: p.lat, lng: p.lng }) <= opts.maxKm!;
    });
  }

  return out;
}
