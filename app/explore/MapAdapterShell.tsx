"use client";

import type { DiscoverableProfile } from "@/src/lib/exploreTypes";

export function MapAdapterShell({
  enabled,
  points,
}: {
  enabled: boolean;
  points: DiscoverableProfile[];
}) {
  const pointsWithCoords = points.filter(
    (p) => typeof p.lat === "number" && typeof p.lng === "number",
  );

  if (!enabled) {
    return (
      <div className="ui-card p-5 font-sans text-sm text-[var(--text-secondary)]">
        Maps are disabled. Set `NEXT_PUBLIC_ENABLE_MAPS=true` when the map module
        is ready.
      </div>
    );
  }

  return (
    <div className="ui-card p-5">
      <p className="ui-label mb-2">Map adapter shell</p>
      <p className="font-sans text-sm text-[var(--text-secondary)]">
        Map integration is enabled and isolated behind this adapter. Currently
        showing list-first fallback while map renderer is finalized.
      </p>
      <p className="mt-3 font-sans text-sm text-[var(--text-tertiary)]">
        Coordinate-ready profiles: {pointsWithCoords.length} / {points.length}
      </p>
    </div>
  );
}