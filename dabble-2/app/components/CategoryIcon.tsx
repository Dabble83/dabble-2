"use client";

/**
 * Line-art category placeholders per docs/CURSOR_BUILD_PROMPTS.md §2.2.
 * Replace with final icons when the illustration pack ships.
 */

const STROKE = 1.4;

/** Core categories (§2.2 accent table). `bikes` | `water` | `bird` are home-strip extensions until assets land. */
export type CategoryIconCategory =
  | "outdoor"
  | "diy"
  | "craft"
  | "food"
  | "music"
  | "bikes"
  | "water"
  | "bird";

const ACCENT: Record<CategoryIconCategory, string> = {
  outdoor: "#7A8F6A",
  diy: "#C46A3E",
  craft: "#B85C38",
  food: "#5A6E48",
  music: "#1F2A37",
  bikes: "#6b736b",
  water: "#4d5c4d",
  bird: "#2a3d2c",
};

function IconGlyph({ category, color }: { category: CategoryIconCategory; color: string }) {
  const common = {
    stroke: color,
    strokeWidth: STROKE,
    fill: "none" as const,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (category) {
    case "outdoor":
      return <path d="M 11 29 L 20 11 L 29 29" {...common} />;
    case "diy":
      return (
        <g {...common}>
          <path d="M 22 28 L 22 15" />
          <path d="M 15 15 H 29" />
          <path d="M 15 15 L 17 11 H 27 L 29 15" />
        </g>
      );
    case "craft":
      return (
        <g {...common}>
          <path d="M 14 15 Q 20 11 26 15 Q 20 19 14 15" />
          <path d="M 20 15 V 26" />
          <path d="M 14 26 Q 20 30 26 26 Q 20 22 14 26" />
        </g>
      );
    case "food":
      return (
        <g {...common}>
          <path d="M 12 17 Q 20 29 28 17" />
          <path d="M 16 19 V 21" />
          <path d="M 20 20 V 22" />
          <path d="M 24 19 V 21" />
        </g>
      );
    case "music":
      return <path d="M 20 9 L 26 21 Q 20 27 14 21 Z" {...common} />;
    case "bikes":
      return (
        <g {...common}>
          <circle cx="14" cy="24" r="5" />
          <circle cx="26" cy="24" r="5" />
          <path d="M 14 24 L 20 14 L 26 24" />
          <path d="M 20 14 L 20 10" />
        </g>
      );
    case "water":
      return <path d="M 9 22 Q 14.5 17 20 22 T 31 22" {...common} />;
    case "bird":
      return <path d="M 9 24 Q 20 8 31 20" {...common} />;
  }
}

export type CategoryIconProps = {
  category: CategoryIconCategory;
  /** Pixel width/height of the icon (square). Default 40. */
  size?: number;
};

export function CategoryIcon({ category, size = 40 }: CategoryIconProps) {
  const color = ACCENT[category];
  const label =
    category === "outdoor"
      ? "Outdoor"
      : category === "diy"
        ? "DIY"
        : category === "craft"
          ? "Craft"
          : category === "food"
            ? "Food"
            : category === "music"
              ? "Music"
              : category === "bikes"
                ? "Bikes"
                : category === "water"
                  ? "Water"
                  : "Bird";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      role="img"
      aria-label={`${label} category`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="20" cy="20" r="17" fill="var(--surface)" stroke="var(--rule)" strokeWidth={1} />
      <IconGlyph category={category} color={color} />
    </svg>
  );
}
