/**
 * Signup onboarding — 5 lanes × 3 sub-topics (Explore / §2.3 alignment).
 * Stored on profile as human-readable tags: "Outdoor — Trails & hikes".
 */
import type { ExploreCategoryId } from "@/src/lib/exploreTypes";

export type OnboardingSubtopic = {
  id: string;
  categoryId: ExploreCategoryId;
  label: string;
};

export type OnboardingCategoryGroup = {
  categoryId: ExploreCategoryId;
  categoryLabel: string;
  pinHex: string;
  subtopics: OnboardingSubtopic[];
};

/** Three sub-topics per lane (~15 chips total). Pin hex matches §2.3 Explore pins. */
export const ONBOARDING_CATEGORY_GROUPS: OnboardingCategoryGroup[] = [
  {
    categoryId: "outdoor",
    categoryLabel: "Outdoor",
    pinHex: "#6d8570",
    subtopics: [
      { id: "outdoor.trails", categoryId: "outdoor", label: "Trails & hikes" },
      { id: "outdoor.garden", categoryId: "outdoor", label: "Garden & plants" },
      { id: "outdoor.water", categoryId: "outdoor", label: "Water & paddle" },
    ],
  },
  {
    categoryId: "diy",
    categoryLabel: "DIY",
    pinHex: "#c4a574",
    subtopics: [
      { id: "diy.home", categoryId: "diy", label: "Home repair" },
      { id: "diy.wood", categoryId: "diy", label: "Wood & tools" },
      { id: "diy.bikes", categoryId: "diy", label: "Bikes & tune-ups" },
    ],
  },
  {
    categoryId: "craft",
    categoryLabel: "Craft",
    pinHex: "#c4785a",
    subtopics: [
      { id: "craft.textiles", categoryId: "craft", label: "Textiles & fiber" },
      { id: "craft.paper", categoryId: "craft", label: "Paper & print" },
      { id: "craft.ceramic", categoryId: "craft", label: "Clay & objects" },
    ],
  },
  {
    categoryId: "food",
    categoryLabel: "Food",
    pinHex: "#5c7a56",
    subtopics: [
      { id: "food.cook", categoryId: "food", label: "Cooking together" },
      { id: "food.bake", categoryId: "food", label: "Baking & bread" },
      { id: "food.ferment", categoryId: "food", label: "Ferment & preserve" },
    ],
  },
  {
    categoryId: "music",
    categoryLabel: "Music",
    pinHex: "#3d4a5c",
    subtopics: [
      { id: "music.strings", categoryId: "music", label: "Strings & frets" },
      { id: "music.keys", categoryId: "music", label: "Keys & song" },
      { id: "music.rhythm", categoryId: "music", label: "Rhythm & groove" },
    ],
  },
];

export function tagLabelForSubtopic(sub: OnboardingSubtopic, group: OnboardingCategoryGroup): string {
  return `${group.categoryLabel} — ${sub.label}`;
}

export function allSubtopicsFlat(): { sub: OnboardingSubtopic; group: OnboardingCategoryGroup }[] {
  return ONBOARDING_CATEGORY_GROUPS.flatMap((group) =>
    group.subtopics.map((sub) => ({ sub, group })),
  );
}
