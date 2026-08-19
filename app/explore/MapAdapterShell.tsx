"use client";

import type { ReactNode } from "react";
import { ExploreMap } from "@/app/explore/ExploreMap";
import type { DiscoverableProfile } from "@/src/lib/exploreTypes";

type MapAdapterShellProps = {
  enabled: boolean;
  points: DiscoverableProfile[];
  children: ReactNode;
  onSelectProfile?: (profile: DiscoverableProfile) => void;
  mobileShowMap?: boolean;
  focusNeighborhood?: string | null;
};

export function MapAdapterShell({
  enabled,
  points,
  children,
  onSelectProfile,
  focusNeighborhood,
}: MapAdapterShellProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
  const showMap = enabled && Boolean(apiKey);

  if (!enabled) {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 font-sans text-sm text-[var(--text-secondary)]">
          Maps are off. Set{" "}
          <code className="rounded bg-[var(--background)] px-1">NEXT_PUBLIC_ENABLE_MAPS=true</code>{" "}
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
            Maps are enabled, but{" "}
            <code className="rounded bg-[var(--background)] px-1">
              NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
            </code>{" "}
            is not set. The list below still works.
          </p>
        </div>
        {children}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="lg:hidden">{children}</div>
      <div className="w-full" style={{ height: "min(calc(100dvh - 8rem), 800px)" }}>
        <ExploreMap
          profiles={points}
          onSelectProfile={onSelectProfile}
          focusNeighborhood={focusNeighborhood}
        />
      </div>
    </div>
  );
}
