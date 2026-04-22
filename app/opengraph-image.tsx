import { ImageResponse } from "next/og";

export const alt = "Dabble — local skills, shared kindly";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Placeholder Open Graph image (1200×630). Replace this file with a designed export
 * or static `opengraph-image.png` when marketing art is ready.
 */
export default function OgDefaultImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#f4f0e6",
          color: "#1c2424",
        }}
      >
        <div
          style={{
            fontSize: 88,
            fontWeight: 600,
            letterSpacing: "-0.03em",
            fontFamily: "Georgia, 'Times New Roman', serif",
          }}
        >
          Dabble
        </div>
        <div
          style={{
            marginTop: 20,
            fontSize: 32,
            color: "#4a524a",
            fontFamily: "system-ui, sans-serif",
            fontWeight: 500,
          }}
        >
          Local skills, shared kindly
        </div>
        <div
          style={{
            marginTop: 48,
            fontSize: 20,
            color: "#6b736b",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          Placeholder OG — replace with branded image
        </div>
      </div>
    ),
    { ...size },
  );
}
