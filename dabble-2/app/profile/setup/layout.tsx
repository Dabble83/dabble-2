import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Profile setup",
  description:
    "Name, neighborhood, what you teach and want to learn, and discoverability — a calm trail to a complete Dabble profile.",
  alternates: { canonical: "/profile/setup" },
};

export default function ProfileSetupLayout({ children }: { children: ReactNode }) {
  return children;
}
