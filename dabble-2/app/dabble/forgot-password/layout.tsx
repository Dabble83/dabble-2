import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Forgot password",
  description: "Reset your Dabble account password using the email on your account.",
  alternates: { canonical: "/dabble/forgot-password" },
};

export default function ForgotPasswordLayout({ children }: { children: ReactNode }) {
  return children;
}
