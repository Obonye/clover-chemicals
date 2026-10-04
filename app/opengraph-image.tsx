import { ImageResponse } from "next/og";

import { groupTheme } from "@/config/divisions";
import { siteConfig } from "@/config/site";

export const alt = siteConfig.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Generated rather than a static asset — there's no group-brand artwork
// from the client yet (see CI-9). Swap for a designed opengraph-image.jpg
// in this same folder once one exists; the special-file name is identical.
export default function Image() {
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
            color: groupTheme.ogAccent,
          }}
        >
          {`Est. ${siteConfig.foundedYear}`}
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
          {siteConfig.name}
        </div>
        <div
          style={{
            marginTop: 24,
            maxWidth: 900,
            fontSize: 30,
            color: "rgba(255,255,255,0.7)",
          }}
        >
          {siteConfig.description}
        </div>
      </div>
    ),
    size,
  );
}
