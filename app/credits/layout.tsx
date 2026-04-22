import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Credits",
  description:
    "Your Dabble credit balance and ledger — whole credits, short sessions, and how neighbor time moves without cash on the path.",
  alternates: { canonical: "/credits" },
};

export default function CreditsLayout({ children }: { children: ReactNode }) {
  return children;
}
