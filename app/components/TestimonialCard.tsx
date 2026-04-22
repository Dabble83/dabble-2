import type { ReactNode } from "react";
import { Card } from "@/app/components/ui";

export function TestimonialCard({
  quote,
  footer,
}: {
  quote: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <Card>
      <blockquote className="font-serif text-base leading-relaxed text-[var(--text-secondary)]">
        {quote}
      </blockquote>
      {footer ? <footer className="mt-4 font-sans text-xs text-[var(--text-tertiary)]">{footer}</footer> : null}
    </Card>
  );
}
