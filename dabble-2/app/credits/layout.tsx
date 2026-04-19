import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Credits",
  description: "Your Dabble credit balance and activity — neighbor time, not cash.",
};

export default function CreditsLayout({ children }: { children: ReactNode }) {
  return children;
}
