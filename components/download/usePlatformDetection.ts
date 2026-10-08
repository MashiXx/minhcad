"use client";

import { useSyncExternalStore } from "react";
import { platforms, type PlatformId } from "@/lib/site";

type NavigatorWithUAData = Navigator & { userAgentData?: { platform?: string } };

export function isPlatformId(value: string | null | undefined): value is PlatformId {
  return platforms.some((p) => p.id === value);
}

/** Best-effort desktop OS detection. Mobile devices return null (no native build). */
export function detectPlatform(): PlatformId | null {
  const nav = navigator as NavigatorWithUAData;
  const ua = nav.userAgent.toLowerCase();
  if (/android|iphone|ipad|ipod/.test(ua)) return null;

  const source = `${nav.userAgentData?.platform ?? ""} ${nav.platform ?? ""} ${ua}`.toLowerCase();
  if (/windows|win32|win64/.test(source)) return "windows";
  if (source.includes("mac")) return "macos";
  if (source.includes("linux") || source.includes("x11") || source.includes("ubuntu")) return "ubuntu";
  return null;
}

const noopSubscribe = () => () => {};

/**
 * The visitor's OS, read after hydration. The server snapshot is `null`, so the
 * server HTML and the first client render always match.
 */
export function useDetectedPlatform() {
  return useSyncExternalStore(noopSubscribe, detectPlatform, () => null);
}
