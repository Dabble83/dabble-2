/**
 * Canonical site origin for metadata, sitemap, and server-side fetches.
 * Set `NEXT_PUBLIC_SITE_URL` in production (e.g. https://dabble.example).
 */
export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  if (raw) return raw;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`;
  return "http://localhost:3000";
}

export function getMetadataBase(): URL {
  return new URL(getSiteUrl());
}
