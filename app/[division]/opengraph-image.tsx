import { ImageResponse } from "next/og";

import { divisions, getDivision } from "@/config/divisions";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Props = {
  params: Promise<{ division: string }>;
};

// Metadata route files don't inherit generateStaticParams from a sibling
// layout.tsx the way page.tsx does — without this, Next renders this image
// on demand instead of prerendering one per division at build time.
export function generateStaticParams() {
  return divisions.map((d) => ({ division: d.slug }));
}

// Generated per division rather than a static asset — there's no
// per-division social artwork from the client yet (see CI-9). Swap for a
// static opengraph-image.jpg in this same folder once one exists, per
// division, and delete this file.
export default async function Image({ params }: Props) {
  const { division: slug } = await params;
  const division = getDivision(slug);
  const name = division?.name ?? "Clover Industries";
  const tagline = division?.tagline ?? "";
  const accent = division?.theme?.ogAccent ?? division?.theme?.accent ?? "#8bc53f";

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          padding: "80px",
          backgroundColor: "#111111",
        }}
      >
        <div
          style={{
            fontSize: 28,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: accent,
          }}
        >
          Clover Industries
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 76,
            fontWeight: 800,
            color: "#ffffff",
            lineHeight: 1.1,
          }}
        >
          {name}
        </div>
        {tagline && (
          <div
            style={{
              marginTop: 24,
              maxWidth: 900,
              fontSize: 30,
              color: "rgba(255,255,255,0.7)",
            }}
          >
            {tagline}
          </div>
        )}
      </div>
    ),
    size,
  );
}
