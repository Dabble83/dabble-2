import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Profile",
  description: "Redirecting to your public profile or setup — manage how neighbors find you on Dabble.",
  alternates: { canonical: "/profile" },
};

export default function ProfileSectionLayout({ children }: { children: ReactNode }) {
  return children;
}
