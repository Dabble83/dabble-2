import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Explore",
  description:
    "Browse discoverable neighbors by curiosity lane, distance, and who is teaching now — map optional, list always clear.",
  alternates: { canonical: "/explore" },
};

export default function ExploreLayout({ children }: { children: ReactNode }) {
  return children;
}
