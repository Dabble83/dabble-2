"use client";

export function SkipToMain() {
  return (
    <a
      href="#main-content"
      className="skip-to-main"
      onClick={() => {
        window.setTimeout(() => {
          document.getElementById("main-content")?.focus({ preventScroll: false });
        }, 0);
      }}
    >
      Skip to main content
    </a>
  );
}
