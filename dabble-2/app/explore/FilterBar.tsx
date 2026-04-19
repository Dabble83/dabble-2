"use client";

import { Button } from "@/app/components/ui";
import { EXPLORE_CATEGORIES } from "@/src/lib/exploreCategories";
import type { ExploreCategoryId } from "@/src/lib/exploreTypes";

type FilterBarProps = {
  selectedCategories: ExploreCategoryId[];
  onToggleCategory: (id: ExploreCategoryId) => void;
  distanceKm: number;
  onDistanceKmChange: (km: number) => void;
  teachingNow: boolean;
  onTeachingNowChange: (value: boolean) => void;
  hasOrigin: boolean;
  onUseMyLocation: () => void;
  locationLoading?: boolean;
};

export function FilterBar({
  selectedCategories,
  onToggleCategory,
  distanceKm,
  onDistanceKmChange,
  teachingNow,
  onTeachingNowChange,
  hasOrigin,
  onUseMyLocation,
  locationLoading,
}: FilterBarProps) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 md:p-6">
      <div className="space-y-6">
        <div>
          <p className="ui-label mb-2">Categories</p>
          <p className="mb-3 font-sans text-xs text-[var(--text-tertiary)]">
            Tap to narrow who appears — leave empty to see every lane.
          </p>
          <div className="flex flex-wrap gap-2">
            {EXPLORE_CATEGORIES.map((c) => {
              const on = selectedCategories.includes(c.id);
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => onToggleCategory(c.id)}
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 font-sans text-xs font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand)] ${
                    on
                      ? "border-[var(--brand-border)] text-[var(--text-primary)]"
                      : "border-[var(--border)] bg-white text-[var(--text-secondary)] hover:border-[color-mix(in_srgb,var(--brand)_45%,var(--border))]"
                  }`}
                  style={
                    on
                      ? { backgroundColor: `color-mix(in srgb, ${c.pinHex} 18%, white)` }
                      : undefined
                  }
                >
                  <span
                    className="inline-block h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: c.pinHex }}
                    aria-hidden
                  />
                  {c.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="explore-distance" className="ui-label">
            Distance (1–50 km){!hasOrigin ? " — set your location first" : ""}
          </label>
          <input
            id="explore-distance"
            type="range"
            min={1}
            max={50}
            step={1}
            value={distanceKm}
            disabled={!hasOrigin}
            onChange={(e) => onDistanceKmChange(Number(e.target.value))}
            className="w-full accent-[var(--brand)] disabled:opacity-40"
          />
          <p className="font-sans text-xs text-[var(--text-tertiary)]">
            {hasOrigin ? `Within about ${distanceKm} km of you.` : "We use your rough location only for this filter — nothing is stored on the URL beyond coordinates you approve."}
          </p>
        </div>

        <label className="flex items-start gap-3 font-serif text-sm leading-relaxed text-[var(--text-secondary)]">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 accent-[var(--brand)]"
            checked={teachingNow}
            onChange={(e) => onTeachingNowChange(e.target.checked)}
          />
          <span>Teaching now — show neighbors whose availability sounds open soon (today / tonight / this week).</span>
        </label>

        <div className="flex flex-wrap gap-3">
          <Button type="button" variant="secondary" onClick={onUseMyLocation} disabled={Boolean(locationLoading)}>
            {locationLoading ? "Locating…" : "Use my location"}
          </Button>
        </div>
      </div>
    </div>
  );
}
