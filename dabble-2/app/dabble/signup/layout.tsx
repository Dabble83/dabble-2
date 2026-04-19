import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Join",
  description:
    "Create your Dabble account and a short onboarding quiz — curiosity, teaching, and where you are based.",
  alternates: { canonical: "/dabble/signup" },
};

export default function SignUpLayout({ children }: { children: ReactNode }) {
  return children;
}
