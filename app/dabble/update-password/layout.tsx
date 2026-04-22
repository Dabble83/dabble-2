import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Set new password",
  description: "Choose a new password for your Dabble account after following the reset link in your email.",
  alternates: { canonical: "/dabble/update-password" },
};

export default function UpdatePasswordLayout({ children }: { children: ReactNode }) {
  return children;
}
