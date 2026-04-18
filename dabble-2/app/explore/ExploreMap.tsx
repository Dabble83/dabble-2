"use client";

import { Loader } from "@googlemaps/js-api-loader";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { DiscoverableProfile } from "@/src/lib/exploreTypes";

const MAP_STYLE: google.maps.MapTypeStyle[] = [
  { elementType: "geometry", stylers: [{ color: "#f4f0e6" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#4a4a4a" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#c9d8d5" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#e8e2d6" }] },
];

const US_CENTER = { lat: 39.5, lng: -98.35 };
const DEFAULT_ZOOM = 4;

function buildInfoContent(p: DiscoverableProfile): HTMLElement {
  const wrap = document.createElement("div");
  wrap.style.maxWidth = "260px";
  wrap.style.padding = "6px 4px";
  wrap.style.color = "#1c2424";
  wrap.style.fontFamily = "system-ui, sans-serif";

  const title = document.createElement("div");
  title.textContent = p.display_name || "Dabbler";
  title.style.fontFamily = "Georgia, serif";
  title.style.fontSize = "1.05rem";
  title.style.fontWeight = "600";
  title.style.marginBottom = "4px";

  const place = document.createElement("div");
  place.textContent = p.location_label || "Neighborhood not set";
  place.style.fontSize = "12px";
  place.style.color = "#6b736b";
  place.style.marginBottom = "8px";

  const skillsLine = document.createElement("div");
  const topSkills = (p.skills || []).slice(0, 2);
  const label = document.createElement("span");
  label.textContent = "Offers: ";
  label.style.fontWeight = "600";
  const value = document.createElement("span");
  value.textContent = topSkills.length ? topSkills.join(", ") : "—";
  skillsLine.appendChild(label);
  skillsLine.appendChild(value);
  skillsLine.style.fontSize = "12px";
  skillsLine.style.color = "#4a524a";
  skillsLine.style.marginBottom = "10px";

  const link = document.createElement("a");
  link.href = `/profile/${encodeURIComponent(p.username)}`;
  link.textContent = "View profile →";
  link.style.fontSize = "13px";
  link.style.fontWeight = "600";
  link.style.color = "#2a3d2c";

  wrap.appendChild(title);
  wrap.appendChild(place);
  wrap.appendChild(skillsLine);
  wrap.appendChild(link);
  return wrap;
}

type ExploreMapProps = {
  profiles: DiscoverableProfile[];
  onSelectProfile?: (profile: DiscoverableProfile) => void;
};

export function ExploreMap({ profiles, onSelectProfile }: ExploreMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const infoRef = useRef<google.maps.InfoWindow | null>(null);
  const [loadError, setLoadError] = useState<"load_failed" | null>(null);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

  const loader = useMemo(() => {
    if (!apiKey) return null;
    return new Loader({
      apiKey,
      version: "weekly",
      libraries: ["maps"],
    });
  }, [apiKey]);

  const openInfo = useCallback(
    (map: google.maps.Map, marker: google.maps.Marker, p: DiscoverableProfile) => {
      onSelectProfile?.(p);
      if (!infoRef.current) {
        infoRef.current = new google.maps.InfoWindow();
      }
      infoRef.current.setContent(buildInfoContent(p));
      infoRef.current.open({ map, anchor: marker });
    },
    [onSelectProfile],
  );

  useEffect(() => {
    if (!apiKey || !loader) return;
    const mapLoader = loader;

    let cancelled = false;

    async function init() {
      queueMicrotask(() => setLoadError(null));
      try {
        await mapLoader.load();
        if (cancelled || !containerRef.current) return;

        if (!mapRef.current) {
          mapRef.current = new google.maps.Map(containerRef.current, {
            center: US_CENTER,
            zoom: DEFAULT_ZOOM,
            disableDefaultUI: true,
            zoomControl: true,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
            styles: MAP_STYLE,
            backgroundColor: "#f4f0e6",
          });
        }

        const map = mapRef.current;

        for (const m of markersRef.current) {
          m.setMap(null);
        }
        markersRef.current = [];

        const withCoords = profiles.filter(
          (p) => typeof p.lat === "number" && typeof p.lng === "number",
        ) as (DiscoverableProfile & { lat: number; lng: number })[];

        if (withCoords.length === 0) {
          map.setCenter(US_CENTER);
          map.setZoom(DEFAULT_ZOOM);
          return;
        }

        const bounds = new google.maps.LatLngBounds();
        for (const p of withCoords) {
          const marker = new google.maps.Marker({
            map,
            position: { lat: p.lat, lng: p.lng },
            title: p.display_name || p.username,
          });
          marker.addListener("click", () => {
            openInfo(map, marker, p);
          });
          markersRef.current.push(marker);
          bounds.extend({ lat: p.lat, lng: p.lng });
        }

        map.fitBounds(bounds, 48);
      } catch {
        if (!cancelled) setLoadError("load_failed");
      }
    }

    void init();

    return () => {
      cancelled = true;
    };
  }, [apiKey, loader, openInfo, profiles]);

  if (!apiKey) {
    return (
      <div className="flex h-full min-h-[280px] flex-col justify-center rounded-2xl border border-dashed border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_90%,var(--background))] p-6 text-center">
        <p className="font-serif text-lg text-[var(--text-primary)]">Map coming soon</p>
        <p className="mt-2 font-sans text-sm text-[var(--text-secondary)]">
          Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in Vercel to show the neighborhood map.
        </p>
      </div>
    );
  }

  if (loadError === "load_failed") {
    return (
      <div className="flex h-full min-h-[280px] flex-col justify-center rounded-2xl border border-dashed border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_90%,var(--background))] p-6 text-center">
        <p className="font-serif text-lg text-[var(--text-primary)]">Map coming soon</p>
        <p className="mt-2 font-sans text-sm text-[var(--text-secondary)]">
          We could not load Google Maps. Check the browser key and try again.
        </p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="h-full min-h-[min(100dvh,56rem)] w-full rounded-2xl border border-[var(--border)] bg-[#f4f0e6] lg:min-h-[calc(100dvh-8rem)]"
    />
  );
}
