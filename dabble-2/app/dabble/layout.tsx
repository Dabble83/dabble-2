import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Account",
  description: "Sign in or create your Dabble account — neighbors first, calm onboarding.",
  robots: { index: false, follow: true },
};

export default function DabbleAuthLayout({ children }: { children: ReactNode }) {
  return children;
}
