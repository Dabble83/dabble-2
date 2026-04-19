import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

const now = new Date();

/** Public marketing and product routes (no authenticated-only shells). */
const STATIC_PATHS = [
  "",
  "/explore",
  "/about",
  "/how-it-works",
  "/safety",
  "/guidelines",
  "/credits",
  "/profile/setup",
  "/profile/demo-user",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  return STATIC_PATHS.map((path) => ({
    url: path === "" ? base : `${base}${path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : path === "/explore" ? 0.95 : 0.75,
  }));
}
