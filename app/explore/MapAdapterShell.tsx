"use client";

import type { ReactNode } from "react";
import { ExploreMap } from "@/app/explore/ExploreMap";
import type { DiscoverableProfile } from "@/src/lib/exploreTypes";

type MapAdapterShellProps = {
  enabled: boolean;
  points: DiscoverableProfile[];
  /** Sidebar: filters + profile list */
  children: ReactNode;
  onSelectProfile?: (profile: DiscoverableProfile) => void;
  /** On small screens: when false (default), list is shown; when true, map is shown. Desktop always shows both. */
  mobileShowMap?: boolean;
};

/**
 * When maps are enabled and a browser key exists: desktop = sidebar (40%) left,
 * map (60%) right, both full viewport height. On small screens, list is default
 * unless `mobileShowMap` is true.
 */
export function MapAdapterShell({
  enabled,
  points,
  children,
  onSelectProfile,
  mobileShowMap = false,
}: MapAdapterShellProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
  const showMap = enabled && Boolean(apiKey);

  if (!enabled) {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 font-sans text-sm text-[var(--text-secondary)]">
          Maps are off. Set <code className="rounded bg-[var(--background)] px-1">NEXT_PUBLIC_ENABLE_MAPS=true</code>{" "}
          and add a Maps browser key to see dabblers on the map.
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
    <div className="flex min-h-0 flex-col gap-6 lg:min-h-[calc(100dvh-8rem)] lg:flex-row lg:gap-0">
      <div
        className={`order-1 flex min-h-0 w-full flex-col lg:order-1 lg:w-[40%] lg:max-w-[40%] lg:border-r lg:border-[var(--border)] lg:pr-6 ${
          mobileShowMap ? "max-lg:hidden" : ""
        }`}
      >
        <div className="min-h-0 flex-1 overflow-y-auto pr-1">{children}</div>
      </div>
      <div
        className={`order-2 w-full min-h-[min(70dvh,28rem)] lg:order-2 lg:min-h-[calc(100dvh-8rem)] lg:flex-1 lg:min-w-0 lg:pl-6 ${
          mobileShowMap ? "" : "max-lg:hidden"
        }`}
      >
        <ExploreMap profiles={points} onSelectProfile={onSelectProfile} />
      </div>
    </div>
  );
}
