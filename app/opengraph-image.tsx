import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { OgCanvas, OgCornerMarks, OgWordmark, ogColors, ogSize } from "@/lib/og/brand";
import { release, site } from "@/lib/site";

export const alt = `${site.name} — Professional CAD software for Windows, macOS and Ubuntu`;
export const size = ogSize;
export const contentType = "image/png";

// Read once at build time. Satori does not decode WebP, so the PNG capture is used.
const screenshot = await readFile(join(process.cwd(), "public/screenshots/cad-3d.png"));
const screenshotSrc = `data:image/png;base64,${screenshot.toString("base64")}`;

const SHOT_WIDTH = 760;
const SHOT_HEIGHT = Math.round((SHOT_WIDTH * 414) / 840);

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <OgCanvas glow="78% 45%">
        <OgCornerMarks />

        {/* Product capture in a window frame, bleeding off the right edge */}
        <div
          style={{
            position: "absolute",
            left: 590,
            top: 132,
            display: "flex",
            flexDirection: "column",
            borderRadius: 14,
            border: `1px solid ${ogColors.lineStrong}`,
            backgroundColor: ogColors.surface,
            overflow: "hidden",
            boxShadow: "0 40px 120px rgba(0,0,0,0.85)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              height: 34,
              paddingLeft: 14,
              backgroundColor: ogColors.surface2,
              borderBottom: `1px solid ${ogColors.line}`,
            }}
          >
            <div style={{ display: "flex", width: 10, height: 10, borderRadius: 10, backgroundColor: "rgba(255,255,255,0.14)" }} />
            <div style={{ display: "flex", width: 10, height: 10, borderRadius: 10, backgroundColor: "rgba(255,255,255,0.14)" }} />
            <div style={{ display: "flex", width: 10, height: 10, borderRadius: 10, backgroundColor: "rgba(255,255,255,0.14)" }} />
            <div style={{ display: "flex", marginLeft: 12, fontSize: 14, color: ogColors.muted }}>
              {`fanuc-430-arm.dxf — ${site.name}`}
            </div>
          </div>
          <img src={screenshotSrc} width={SHOT_WIDTH} height={SHOT_HEIGHT} alt="" />
        </div>

        <div
          style={{
            position: "absolute",
            left: 80,
            top: 76,
            bottom: 76,
            width: 480,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <OgWordmark size={34} />

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                fontSize: 76,
                lineHeight: 1.02,
                letterSpacing: -3,
                color: ogColors.fg,
              }}
            >
              <span>Design.</span>
              <span>Model.</span>
              <span style={{ color: ogColors.accentHover }}>Engineer.</span>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", marginTop: 28, fontSize: 25, lineHeight: 1.4, color: ogColors.muted }}
            >
              <span>Professional CAD for</span>
              <span>Windows · macOS · Ubuntu</span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 16, letterSpacing: 2, color: ogColors.subtle }}>
            <div style={{ display: "flex", width: 8, height: 8, borderRadius: 8, backgroundColor: ogColors.accent }} />
            <span>{`VERSION ${release.version} · ${release.channel.toUpperCase()}`}</span>
          </div>
        </div>
      </OgCanvas>
    ),
    { ...size },
  );
}
