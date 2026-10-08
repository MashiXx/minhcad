import type { ReactNode } from "react";

/**
 * Shared building blocks for generated OpenGraph images (next/og / Satori).
 * Satori supports flexbox only: every element with several children sets
 * display: "flex" explicitly.
 */
export const ogSize = { width: 1200, height: 630 } as const;

export const ogColors = {
  bg: "#080A0D",
  surface: "#0D1117",
  surface2: "#11161D",
  fg: "#F5F7FA",
  muted: "#8D98A8",
  subtle: "#5D6876",
  accent: "#2F7BFF",
  accentHover: "#4A8CFF",
  line: "rgba(255,255,255,0.08)",
  lineStrong: "rgba(255,255,255,0.14)",
} as const;

const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M16 2.5 28 9.25v13.5L16 29.5 4 22.75V9.25L16 2.5Z" fill="#2f7bff" fill-opacity="0.14"/><path d="M16 2.5 28 9.25v13.5L16 29.5 4 22.75V9.25L16 2.5Zm0 0v13.5m0 0 12-6.75M16 16 4 9.25" fill="none" stroke="#4a8cff" stroke-width="1.6" stroke-linejoin="round"/><path d="M16 16v13.5" stroke="#f5f7fa" stroke-width="1.6"/><path d="M10 19.4 16 16l6 3.4" fill="none" stroke="#f5f7fa" stroke-width="1.6" stroke-linejoin="round"/></svg>`;

export const logoDataUri = `data:image/svg+xml;base64,${Buffer.from(logoSvg).toString("base64")}`;

/** Dark canvas with the CAD grid and a faint blue glow. */
export function OgCanvas({ children, glow = "75% 35%" }: { children: ReactNode; glow?: string }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        backgroundColor: ogColors.bg,
        color: ogColors.fg,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.045) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundImage: `radial-gradient(circle at ${glow}, rgba(47,123,255,0.20), rgba(8,10,13,0) 55%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundImage: "linear-gradient(to bottom, rgba(8,10,13,0) 55%, rgba(8,10,13,0.9))",
        }}
      />
      {children}
    </div>
  );
}

/** KufCad wordmark: logo mark + "Kuf" in foreground and "Cad" in accent. */
export function OgWordmark({ size = 34, suffix }: { size?: number; suffix?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: Math.round(size * 0.4) }}>
      {/* eslint-disable-next-line @next/next/no-img-element -- Satori renders plain <img>. */}
      <img src={logoDataUri} width={Math.round(size * 1.3)} height={Math.round(size * 1.3)} alt="" />
      <div style={{ display: "flex", fontSize: size, letterSpacing: -0.5 }}>
        <span style={{ color: ogColors.fg }}>Kuf</span>
        <span style={{ color: ogColors.accentHover, marginLeft: -Math.round(size * 0.06) }}>Cad</span>
        {suffix ? <span style={{ color: ogColors.subtle, marginLeft: Math.round(size * 0.4) }}>{suffix}</span> : null}
      </div>
    </div>
  );
}

/** Small corner ticks framing the canvas (absolute coordinates; Satori ignores right/bottom here). */
export function OgCornerMarks({ inset = 32 }: { inset?: number }) {
  const size = 16;
  const far = { x: ogSize.width - inset - size, y: ogSize.height - inset - size };
  const tick = { position: "absolute" as const, width: size, height: size, display: "flex" };
  const border = `1px solid ${ogColors.lineStrong}`;
  return (
    <>
      <div style={{ ...tick, left: inset, top: inset, borderLeft: border, borderTop: border }} />
      <div style={{ ...tick, left: far.x, top: inset, borderRight: border, borderTop: border }} />
      <div style={{ ...tick, left: inset, top: far.y, borderLeft: border, borderBottom: border }} />
      <div style={{ ...tick, left: far.x, top: far.y, borderRight: border, borderBottom: border }} />
    </>
  );
}
