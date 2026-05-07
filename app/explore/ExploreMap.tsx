"use client";

import { Loader } from "@googlemaps/js-api-loader";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { enrichDiscoverableProfile, pinColorForCategory } from "@/src/lib/exploreCategories";
import type { DiscoverableProfile, ExploreCategoryId } from "@/src/lib/exploreTypes";

const MAP_STYLE: google.maps.MapTypeStyle[] = [
  { elementType: "geometry", stylers: [{ color: "#f2ebe3" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#4a524a" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#f2ebe3" }, { lightness: 12 }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#b8cdc4" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#4d6658" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#d6cfc3" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#c4bdb2" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#ddd5c8" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#d8e2d4" }] },
  { featureType: "administrative", elementType: "geometry.stroke", stylers: [{ color: "#dcd4c8" }] },
];

const MAP_BG = "#f2ebe3";
const US_CENTER = { lat: 39.5, lng: -98.35 };
const DEFAULT_ZOOM = 4;
const LOCATION_PIN_COLOR = "#2563EB";
const LOCATION_PIN_HOVER_COLOR = "#1D4ED8";

function nameInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  return parts.slice(0, 2).map((w) => w[0] ?? "").join("").toUpperCase() || "N";
}

function isSkillSharePin(p: DiscoverableProfile): boolean {
  const hasSkills = (p.skills_offered ?? p.skills ?? []).length > 0;
  const hasInterests = (p.skills_curious ?? p.interests ?? []).length > 0;
  return hasSkills || hasInterests;
}

function createPinElement(p: DiscoverableProfile, hovered = false): HTMLElement {
  const size = hovered ? 52 : 40;
  const pinHeight = Math.round(size * 1.35);
  const avatarSize = Math.round(size * 0.62);
  const avatarOffset = Math.round((size - avatarSize) / 2);

  const wrap = document.createElement("div");
  wrap.style.cssText = `position:relative;width:${size}px;height:${pinHeight}px;cursor:pointer;transition:width 0.12s,height 0.12s;filter:drop-shadow(0 3px 8px rgba(0,0,0,0.32));`;

  const color = hovered ? LOCATION_PIN_HOVER_COLOR : LOCATION_PIN_COLOR;
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 40 54");
  svg.style.cssText = `position:absolute;top:0;left:0;width:${size}px;height:${pinHeight}px;`;
  svg.innerHTML = `<path d="M20 0C9 0 0 9 0 20c0 15 20 34 20 34S40 35 40 20C40 9 31 0 20 0z" fill="${color}"/>`;
  wrap.appendChild(svg);

  const avatarEl = document.createElement("div");
  avatarEl.style.cssText = `position:absolute;top:${avatarOffset - 1}px;left:${avatarOffset}px;width:${avatarSize}px;height:${avatarSize}px;border-radius:50%;overflow:hidden;border:2px solid rgba(255,255,255,0.85);background:#1e40af;display:flex;align-items:center;justify-content:center;font-family:system-ui,sans-serif;font-size:${Math.round(avatarSize * 0.38)}px;font-weight:700;color:#fff;`;

  const avatarUrl = typeof p.avatar_url === "string" ? p.avatar_url.trim() : "";
  const displayName = p.display_name || "Dabbler";

  if (avatarUrl) {
    const img = document.createElement("img");
    img.src = avatarUrl;
    img.alt = "";
    img.style.cssText = "width:100%;height:100%;object-fit:cover;";
    img.onerror = () => { img.remove(); avatarEl.textContent = nameInitials(displayName); };
    avatarEl.appendChild(img);
  } else {
    avatarEl.textContent = nameInitials(displayName);
  }

  wrap.appendChild(avatarEl);
  return wrap;
}

function createDotElement(fill: string, hovered = false): HTMLElement {
  const el = document.createElement("div");
  el.style.cssText = `width:${hovered ? "20px" : "14px"};height:${hovered ? "20px" : "14px"};border-radius:50%;background-color:${fill};border:2px solid #fffcf7;box-shadow:0 2px 8px rgba(0,0,0,0.28);cursor:pointer;transition:width 0.12s,height 0.12s;`;
  return el;
}

function buildHoverCard(p: DiscoverableProfile): HTMLElement {
  const wrap = document.createElement("div");
  wrap.style.cssText = "max-width:260px;min-width:200px;padding:14px 16px;color:#1c2424;font-family:system-ui,sans-serif;border-radius:14px;";

  const displayName = p.display_name || "Dabbler";
  const enriched = enrichDiscoverableProfile(p);
  const initialsFill = pinColorForCategory(enriched.primary_category as ExploreCategoryId);

  const avatarRow = document.createElement("div");
  avatarRow.style.cssText = "display:flex;align-items:center;gap:10px;margin-bottom:10px;";

  const avatarUrl = typeof p.avatar_url === "string" ? p.avatar_url.trim() : "";
  const avatarEl = document.createElement("div");
  avatarEl.style.cssText = `width:44px;height:44px;border-radius:50%;border:2px solid #fffcf7;box-shadow:0 1px 4px rgba(0,0,0,0.12);overflow:hidden;flex-shrink:0;background:${initialsFill};display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:700;color:#fff;`;

  if (avatarUrl) {
    const img = document.createElement("img");
    img.src = avatarUrl;
    img.alt = "";
    img.style.cssText = "width:100%;height:100%;object-fit:cover;";
    img.onerror = () => { img.remove(); avatarEl.textContent = nameInitials(displayName); };
    avatarEl.appendChild(img);
  } else {
    avatarEl.textContent = nameInitials(displayName);
  }

  const nameCol = document.createElement("div");
  const nameEl = document.createElement("div");
  nameEl.textContent = displayName;
  nameEl.style.cssText = "font-family:Georgia,serif;font-size:15px;font-weight:600;color:#1c2424;line-height:1.2;";
  const placeEl = document.createElement("div");
  placeEl.textContent = p.location_label || "";
  placeEl.style.cssText = "font-size:11px;color:#6b736b;margin-top:2px;";
  nameCol.appendChild(nameEl);
  nameCol.appendChild(placeEl);
  avatarRow.appendChild(avatarEl);
  avatarRow.appendChild(nameCol);
  wrap.appendChild(avatarRow);

  const skills = (p.skills_offered ?? p.skills ?? []).slice(0, 3);
  const interests = (p.skills_curious ?? p.interests ?? []).slice(0, 2);

  if (skills.length) {
    const row = document.createElement("div");
    row.style.cssText = "margin-bottom:6px;";
    const label = document.createElement("div");
    label.textContent = "Offers";
    label.style.cssText = "font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#4a524a;margin-bottom:4px;";
    const pills = document.createElement("div");
    pills.style.cssText = "display:flex;flex-wrap:wrap;gap:4px;";
    skills.forEach((s) => {
      const pill = document.createElement("span");
      pill.textContent = s;
      pill.style.cssText = "background:#dbeafe;color:#1e40af;font-size:11px;padding:2px 8px;border-radius:999px;font-weight:500;";
      pills.appendChild(pill);
    });
    row.appendChild(label);
    row.appendChild(pills);
    wrap.appendChild(row);
  }

  if (interests.length) {
    const row = document.createElement("div");
    row.style.cssText = "margin-bottom:10px;";
    const label = document.createElement("div");
    label.textContent = "Curious about";
    label.style.cssText = "font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#4a524a;margin-bottom:4px;";
    const pills = document.createElement("div");
    pills.style.cssText = "display:flex;flex-wrap:wrap;gap:4px;";
    interests.forEach((s) => {
      const pill = document.createElement("span");
      pill.textContent = s;
      pill.style.cssText = "background:#f0ede8;color:#4a3a2a;font-size:11px;padding:2px 8px;border-radius:999px;font-weight:500;";
      pills.appendChild(pill);
    });
    row.appendChild(label);
    row.appendChild(pills);
    wrap.appendChild(row);
  }

  const link = document.createElement("a");
  link.href = `/profile/${encodeURIComponent(p.username)}`;
  link.textContent = "View profile →";
  link.style.cssText = "font-size:12px;font-weight:600;color:#2563eb;text-decoration:none;display:inline-block;margin-top:2px;";
  wrap.appendChild(link);

  return wrap;
}

function buildSearchBox(map: google.maps.Map, onPlaceSelected: (location: google.maps.LatLng, name: string) => void): () => void {
  const wrapper = document.createElement("div");
  wrapper.style.cssText = "position:absolute;top:12px;left:50%;transform:translateX(-50%);z-index:10;width:min(340px,calc(100% - 32px));";
  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Search a location…";
  input.style.cssText = "width:100%;padding:10px 16px;border-radius:12px;border:1.5px solid #dcd4c8;background:#fffcf7;font-family:system-ui,sans-serif;font-size:14px;color:#1c2424;box-shadow:0 4px 16px rgba(0,0,0,0.14);outline:none;box-sizing:border-box;";
  input.addEventListener("focus", () => { input.style.borderColor = "#2563eb"; });
  input.addEventListener("blur", () => { input.style.borderColor = "#dcd4c8"; });
  wrapper.appendChild(input);
  const container = map.getDiv();
  container.style.position = "relative";
  container.appendChild(wrapper);
  const autocomplete = new google.maps.places.Autocomplete(input, { types: ["geocode", "establishment"], fields: ["geometry", "name", "formatted_address"] });
  autocomplete.addListener("place_changed", () => {
    const place = autocomplete.getPlace();
    if (!place.geometry?.location) return;
    onPlaceSelected(place.geometry.location, place.name ?? place.formatted_address ?? "");
  });
  return () => { if (container.contains(wrapper)) container.removeChild(wrapper); };
}

type ExploreMapProps = {
  profiles: DiscoverableProfile[];
  onSelectProfile?: (profile: DiscoverableProfile) => void;
  focusNeighborhood?: string | null;
};

export function ExploreMap({ profiles, onSelectProfile, focusNeighborhood }: ExploreMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markersRef = useRef<{ marker: any; profile: DiscoverableProfile; isPin: boolean }[]>([]);
  const infoRef = useRef<google.maps.InfoWindow | null>(null);
  const searchCleanupRef = useRef<(() => void) | null>(null);
  const [loadError, setLoadError] = useState<"load_failed" | null>(null);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
  const mapId = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID ?? "";

  const loader = useMemo(() => {
    if (!apiKey) return null;
    return new Loader({ apiKey, version: "weekly", libraries: ["maps", "marker", "places"] });
  }, [apiKey]);

  const openHoverCard = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (map: google.maps.Map, marker: any, p: DiscoverableProfile) => {
      onSelectProfile?.(p);
      if (!infoRef.current) infoRef.current = new google.maps.InfoWindow({ disableAutoPan: true });
      infoRef.current.setContent(buildHoverCard(p));
      infoRef.current.open({ map, anchor: marker });
    },
    [onSelectProfile],
  );

  useEffect(() => {
    if (!focusNeighborhood || !mapRef.current || !apiKey) return;
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: focusNeighborhood + ", New York, NY" }, (results, status) => {
      if (status === "OK" && results?.[0]?.geometry?.location && mapRef.current) {
        mapRef.current.panTo(results[0].geometry.location);
        mapRef.current.setZoom(14);
      }
    });
  }, [focusNeighborhood, apiKey]);

  useEffect(() => {
    if (!apiKey || !loader) return;
    const mapLoader = loader;
    const resolvedMapId = mapId || undefined;
    let cancelled = false;

    function attachHoverEvents(
      el: HTMLElement,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      marker: any,
      p: DiscoverableProfile,
      map: google.maps.Map,
      isPin: boolean,
    ) {
      el.addEventListener("mouseenter", () => {
        if (isPin) {
          const hovered = createPinElement(p, true);
          marker.content = hovered;
          attachHoverEvents(hovered, marker, p, map, isPin);
        } else {
          el.style.width = "20px";
          el.style.height = "20px";
        }
        openHoverCard(map, marker, p);
      });
      el.addEventListener("mouseleave", () => {
        if (isPin) {
          const normal = createPinElement(p, false);
          marker.content = normal;
          attachHoverEvents(normal, marker, p, map, isPin);
        } else {
          el.style.width = "14px";
          el.style.height = "14px";
        }
      });
    }

    async function init() {
      queueMicrotask(() => setLoadError(null));
      try {
        await mapLoader.load();
        if (cancelled || !containerRef.current) return;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { AdvancedMarkerElement } = (await google.maps.importLibrary("marker")) as any;

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
            backgroundColor: MAP_BG,
            ...(resolvedMapId ? { mapId: resolvedMapId } : {}),
          });
          if (searchCleanupRef.current) searchCleanupRef.current();
          searchCleanupRef.current = buildSearchBox(mapRef.current, (location) => {
            mapRef.current?.panTo(location);
            mapRef.current?.setZoom(13);
          });
        }

        const map = mapRef.current;
        for (const m of markersRef.current) m.marker.map = null;
        markersRef.current = [];

        const withCoords = profiles.filter(
          (p) => typeof p.lat === "number" && typeof p.lng === "number",
        ) as (DiscoverableProfile & { lat: number; lng: number })[];

        if (withCoords.length === 0) { map.setCenter(US_CENTER); map.setZoom(DEFAULT_ZOOM); return; }

        const bounds = new google.maps.LatLngBounds();

        for (const p of withCoords) {
          const enriched = enrichDiscoverableProfile(p);
          const fill = pinColorForCategory(enriched.primary_category as ExploreCategoryId);
          const isPin = isSkillSharePin(p);
          try {
            const markerEl = isPin ? createPinElement(p) : createDotElement(fill);
            const marker = new AdvancedMarkerElement({
              map,
              position: { lat: p.lat, lng: p.lng },
              title: p.display_name || p.username,
              content: markerEl,
              zIndex: isPin ? 10 : 1,
            });
            markersRef.current.push({ marker, profile: p, isPin });
            attachHoverEvents(markerEl, marker, p, map, isPin);
            marker.addListener("click", () => {
              window.location.href = `/profile/${encodeURIComponent(p.username)}`;
            });
          } catch (markerErr) {
            console.error("[ExploreMap] marker failed:", markerErr);
          }
          bounds.extend({ lat: p.lat, lng: p.lng });
        }

        map.fitBounds(bounds, 80);
        map.addListener("click", () => { infoRef.current?.close(); });
      } catch (err) {
        console.error("[ExploreMap] load failed:", err);
        if (!cancelled) setLoadError("load_failed");
      }
    }

    void init();
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiKey, mapId, loader, openHoverCard, profiles]);

  useEffect(() => {
    return () => {
      if (searchCleanupRef.current) { searchCleanupRef.current(); searchCleanupRef.current = null; }
    };
  }, []);

  if (!apiKey) {
    return (
      <div className="flex h-full min-h-[280px] flex-col justify-center rounded-2xl border border-dashed border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_90%,var(--background))] p-6 text-center">
        <p className="font-serif text-lg text-[var(--text-primary)]">Map coming soon</p>
        <p className="mt-2 font-sans text-sm text-[var(--text-secondary)]">Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in Vercel to show the neighborhood map.</p>
      </div>
    );
  }

  if (loadError === "load_failed") {
    return (
      <div className="flex h-full min-h-[280px] flex-col justify-center rounded-2xl border border-dashed border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_90%,var(--background))] p-6 text-center">
        <p className="font-serif text-lg text-[var(--text-primary)]">Map coming soon</p>
        <p className="mt-2 font-sans text-sm text-[var(--text-secondary)]">We could not load Google Maps. Check the browser key and try again.</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="h-full w-full rounded-2xl border border-[var(--border)]"
      style={{ backgroundColor: MAP_BG, minHeight: "min(calc(100dvh - 8rem), 800px)" }}
    />
  );
}
