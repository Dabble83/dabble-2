"use client";

import type { ReactNode } from "react";
import { ExploreMap } from "@/app/explore/ExploreMap";
import type { DiscoverableProfile } from "@/src/lib/exploreTypes";

type MapAdapterShellProps = {
  enabled: boolean;
  /** All discoverable profiles (map pins use lat/lng when present) */
  points: DiscoverableProfile[];
  /** Right column: filters + list */
  children: ReactNode;
  onSelectProfile?: (profile: DiscoverableProfile) => void;
};

/**
 * When maps are enabled and a browser key exists, shows a 60/40 split:
 * Google Map (left) + scrollable list (right). Otherwise list-only with a calm notice.
 */
export function MapAdapterShell({
  enabled,
  points,
  children,
  onSelectProfile,
}: MapAdapterShellProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
  const showMap = enabled && Boolean(apiKey);

  if (!enabled) {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 font-sans text-sm text-[var(--text-secondary)]">
          Maps are off. Set <code className="rounded bg-[var(--background)] px-1">NEXT_PUBLIC_ENABLE_MAPS=true</code>{" "}
          and add a Maps browser key to see the neighborhood map.
        </div>
        {children}
      </div>
    );
  }

  if (!showMap) {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_92%,var(--background))] p-5 text-center">
          <p className="font-serif text-lg text-[var(--text-primary)]">Map coming soon</p>
          <p className="mt-2 font-sans text-sm text-[var(--text-secondary)]">
            Maps are enabled, but <code className="rounded bg-[var(--background)] px-1">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code>{" "}
            is not set. The list below still works.
          </p>
        </div>
        {children}
      </div>
    );
  }

  return (
    <div className="flex min-h-[min(70vh,720px)] flex-col gap-6 lg:flex-row lg:gap-0">
      <div className="min-h-[320px] w-full lg:w-[60%] lg:min-w-0 lg:pr-4">
        <ExploreMap profiles={points} onSelectProfile={onSelectProfile} />
      </div>
      <div className="flex w-full min-h-0 flex-1 flex-col border-t border-[var(--border)] pt-6 lg:w-[40%] lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
        <div className="min-h-0 flex-1 overflow-y-auto pr-1 lg:max-h-[min(70vh,720px)]">{children}</div>
      </div>
    </div>
  );
}
