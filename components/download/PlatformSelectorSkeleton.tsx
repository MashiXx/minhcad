import { PlatformIcon } from "@/components/icons/PlatformIcons";
import { platforms } from "@/lib/site";

const block = "rounded-md bg-white/[0.05] motion-safe:animate-pulse";

/**
 * Static placeholder shown in the prerendered HTML while the selector reads
 * the URL on the client. Mirrors the real layout to avoid layout shift.
 */
export function PlatformSelectorSkeleton() {
  return (
    <div
      aria-busy="true"
      className="relative overflow-hidden rounded-[16px] border border-line-strong bg-surface-1/90 shadow-[0_40px_120px_-48px_rgb(0_0_0/0.95)]"
    >
      <p className="sr-only">Loading download options…</p>
      <div aria-hidden className="border-b border-line p-2 sm:p-3">
        <div className="grid grid-cols-3 gap-1 rounded-[12px] bg-bg/70 p-1">
          {platforms.map((p) => (
            <span key={p.id} className="flex min-h-11 items-center justify-center gap-2 text-sm font-medium text-muted">
              <PlatformIcon id={p.id} size={16} />
              {p.name}
            </span>
          ))}
        </div>
      </div>
      <div aria-hidden className="p-5 sm:p-7">
        <div className="flex items-start gap-4">
          <span className={`${block} size-12 shrink-0 rounded-[10px]`} />
          <div className="flex-1 space-y-3 pt-1">
            <span className={`${block} block h-5 w-48`} />
            <span className={`${block} block h-3 w-36`} />
          </div>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-[12px] border border-line bg-line sm:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="space-y-3 bg-surface-1 p-4">
              <span className={`${block} block h-2.5 w-14`} />
              <span className={`${block} block h-4 w-20`} />
              <span className={`${block} block h-3 w-16`} />
            </div>
          ))}
        </div>
        <span className={`${block} mt-6 block h-12 w-full rounded-[10px]`} />
        <span className={`${block} mx-auto mt-4 block h-3 w-56`} />
        <span className={`${block} mx-auto mt-4 block h-3 w-72 max-w-full`} />
      </div>
      <div aria-hidden className="h-[420px] border-t border-line" />
    </div>
  );
}
