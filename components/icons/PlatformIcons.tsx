import type { SVGProps } from "react";
import type { PlatformId } from "@/lib/site";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

export function WindowsIcon({ size = 16, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden {...props}>
      <path d="M3 5.1 10.4 4v7.2H3V5.1Zm0 13.8 7.4 1.1v-7.1H3v6Zm8.3 1.2L21 21.5v-8.6h-9.7v7.2Zm0-16.2v7.3H21V2.5l-9.7 1.4Z" />
    </svg>
  );
}

export function AppleIcon({ size = 16, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden {...props}>
      <path d="M16.37 12.6c-.02-2.2 1.8-3.26 1.88-3.31-1.03-1.5-2.62-1.7-3.18-1.73-1.35-.14-2.64.8-3.33.8-.69 0-1.74-.78-2.87-.76-1.47.02-2.83.86-3.59 2.18-1.54 2.66-.39 6.6 1.1 8.76.73 1.06 1.6 2.24 2.73 2.2 1.1-.05 1.51-.71 2.84-.71 1.32 0 1.7.71 2.86.69 1.18-.02 1.93-1.07 2.65-2.13.84-1.22 1.18-2.41 1.2-2.47-.03-.01-2.3-.88-2.32-3.5ZM14.2 6.1c.6-.73 1-1.73.9-2.74-.87.04-1.92.58-2.54 1.3-.56.64-1.05 1.67-.92 2.66.97.07 1.96-.49 2.56-1.22Z" />
    </svg>
  );
}

export function UbuntuIcon({ size = 16, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" aria-hidden {...props}>
      <circle cx="12" cy="12" r="6.6" stroke="currentColor" strokeWidth="2.2" />
      <circle cx="4.2" cy="12" r="2.3" fill="currentColor" stroke="var(--color-bg, #080a0d)" strokeWidth="1.2" />
      <circle cx="15.9" cy="5.25" r="2.3" fill="currentColor" stroke="var(--color-bg, #080a0d)" strokeWidth="1.2" />
      <circle cx="15.9" cy="18.75" r="2.3" fill="currentColor" stroke="var(--color-bg, #080a0d)" strokeWidth="1.2" />
    </svg>
  );
}

export function PlatformIcon({ id, ...props }: IconProps & { id: PlatformId }) {
  if (id === "windows") return <WindowsIcon {...props} />;
  if (id === "macos") return <AppleIcon {...props} />;
  return <UbuntuIcon {...props} />;
}
