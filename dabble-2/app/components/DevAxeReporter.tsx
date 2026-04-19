"use client";

import { useEffect } from "react";

/**
 * Development: run axe-core once after paint. @axe-core/react does not officially support React 18+;
 * we still depend on it so `axe-core` is installed and version-aligned, and run the engine directly here.
 * Only serious + critical violations are surfaced (moderate/minor ignored per project policy).
 */
export function DevAxeReporter() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;

    let cancelled = false;
    const idle = window.requestIdleCallback(
      () => {
        void import("axe-core").then(({ default: axe }) => {
          if (cancelled) return;
          void axe
            .run(document, { resultTypes: ["violations"] })
            .then((results) => {
              if (cancelled) return;
              const severe = results.violations.filter(
                (v) => v.impact === "critical" || v.impact === "serious",
              );
              if (severe.length) {
                console.warn(
                  `[a11y] ${severe.length} serious/critical axe violation(s) — see nodes below`,
                  severe,
                );
              }
            })
            .catch((err: unknown) => {
              console.warn("[a11y] axe run failed:", err);
            });
        });
      },
      { timeout: 2500 },
    );

    return () => {
      cancelled = true;
      window.cancelIdleCallback(idle);
    };
  }, []);

  return null;
}
