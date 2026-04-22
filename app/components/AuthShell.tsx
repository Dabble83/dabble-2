import type { ReactNode } from "react";

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-[calc(100vh-12rem)] overflow-hidden py-16 md:py-24">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 20%, var(--brand) 0, transparent 45%),
            radial-gradient(circle at 80% 10%, var(--brand) 0, transparent 40%),
            radial-gradient(circle at 50% 80%, var(--brand-text) 0, transparent 50%)`,
        }}
        aria-hidden
      />
      <div className="ui-container relative flex justify-center px-4">{children}</div>
    </div>
  );
}
