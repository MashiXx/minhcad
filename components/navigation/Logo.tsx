import Link from "next/link";
import { cn } from "@/lib/utils";
import { site } from "@/lib/site";

/** KufCad mark: an isometric cube cut by a drafting edge. */
export function LogoMark({ className, size = 24 }: { className?: string; size?: number }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} aria-hidden className={className}>
      <path d="M16 2.5 28 9.25v13.5L16 29.5 4 22.75V9.25L16 2.5Z" fill="#2f7bff" fillOpacity="0.14" />
      <path
        d="M16 2.5 28 9.25v13.5L16 29.5 4 22.75V9.25L16 2.5Zm0 0v13.5m0 0 12-6.75M16 16 4 9.25"
        fill="none"
        stroke="#4a8cff"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M16 16v13.5" stroke="#f5f7fa" strokeWidth="1.6" />
      <path d="M10 19.4 16 16l6 3.4" fill="none" stroke="#f5f7fa" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn("group inline-flex items-center gap-2.5 rounded-md text-fg", className)}
      aria-label={`${site.name} home`}
    >
      <LogoMark className="transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:rotate-[-8deg]" />
      <span className="text-[15px] font-semibold tracking-[-0.02em]">
        Kuf<span className="text-accent-hover">Cad</span>
      </span>
    </Link>
  );
}
