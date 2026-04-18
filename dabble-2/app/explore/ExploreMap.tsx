"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { DiscoverableProfile } from "@/src/lib/exploreTypes";

const MAP_STYLE: google.maps.MapTypeStyle[] = [
  { featureType: "all", stylers: [{ saturation: -30 }, { lightness: 10 }] },
  { featureType: "water", stylers: [{ color: "#c9d8c5" }] },
  { featureType: "landscape", stylers: [{ color: "#f4f0e6" }] },
];

declare global {
  interface Window {
    google?: typeof google;
    __dabbleMapsInitPromise?: Promise<void>;
  }
}

function loadGoogleMaps(apiKey: string): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.google?.maps) return Promise.resolve();
  if (window.__dabbleMapsInitPromise) return window.__dabbleMapsInitPromise;

  window.__dabbleMapsInitPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[data-dabble-google-maps="true"]',
    );
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Maps script failed")), {
        once: true,
      });
      return;
    }
    const script = document.createElement("script");
    script.dataset.dabbleGoogleMaps = "true";
    script.async = true;
    script.defer = true;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&loading=async`;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Maps script failed"));
    document.head.appendChild(script);
  });

  return window.__dabbleMapsInitPromise;
}

function buildInfoContent(p: DiscoverableProfile): HTMLElement {
  const wrap = document.createElement("div");
  wrap.style.maxWidth = "260px";
  wrap.style.padding = "6px 4px";
  wrap.style.color = "#1c2424";
  wrap.style.fontFamily = "var(--font-geist-sans), system-ui, sans-serif";

  const title = document.createElement("div");
  title.textContent = p.display_name || "Neighbor";
  title.style.fontFamily = "var(--font-lora), Georgia, serif";
  title.style.fontSize = "1.05rem";
  title.style.fontWeight = "600";
  title.style.marginBottom = "4px";

  const place = document.createElement("div");
  place.textContent = p.location_label || "Neighborhood not set";
  place.style.fontSize = "12px";
  place.style.color = "#6b736b";
  place.style.marginBottom = "8px";

  const skills = document.createElement("div");
  const skillText = (p.skills || []).slice(0, 8).join(", ") || "—";
  skills.innerHTML = `<span style="font-weight:600">Offers:</span> ${skillText}`;
  skills.style.fontSize = "12px";
  skills.style.color = "#4a524a";
  skills.style.marginBottom = "10px";

  const link = document.createElement("a");
  link.href = `/profile/${encodeURIComponent(p.username)}`;
  link.textContent = "View profile →";
  link.style.fontSize = "13px";
  link.style.fontWeight = "600";
  link.style.color = "#2a3d2c";

  wrap.appendChild(title);
  wrap.appendChild(place);
  wrap.appendChild(skills);
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
    if (!apiKey) return;

    let cancelled = false;

    async function init() {
      queueMicrotask(() => setLoadError(null));
      try {
        await loadGoogleMaps(apiKey);
        if (cancelled || !containerRef.current) return;

        if (!mapRef.current) {
          mapRef.current = new google.maps.Map(containerRef.current, {
            center: { lat: 40.6782, lng: -73.9442 },
            zoom: 11,
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
          map.setCenter({ lat: 40.6782, lng: -73.9442 });
          map.setZoom(11);
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
  }, [apiKey, openInfo, profiles]);

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
      className="h-full min-h-[320px] w-full rounded-2xl border border-[var(--border)] bg-[#f4f0e6]"
    />
  );
}
