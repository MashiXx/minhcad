import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type ScreenshotFrameProps = {
  /** Document / window title shown in the title bar. */
  title: string;
  /** Right-aligned metadata in the title bar (e.g. "Model · 1:1000"). */
  meta?: ReactNode;
  /** Bottom status bar content. */
  status?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
};

/**
 * A restrained desktop-window frame for real product screenshots.
 * The screenshot itself is never distorted; overlays sit on top.
 */
export function ScreenshotFrame({ title, meta, status, children, className, bodyClassName }: ScreenshotFrameProps) {
  return (
    <figure
      className={cn(
        "relative overflow-hidden rounded-[14px] border border-line-strong bg-surface-1 shadow-[0_40px_120px_-40px_rgb(0_0_0/0.9),0_0_0_1px_rgb(0_0_0/0.4)]",
        className,
      )}
    >
      <div className="flex h-9 items-center gap-3 border-b border-line bg-surface-2/90 px-3.5">
        <span aria-hidden className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-white/12" />
          <span className="size-2.5 rounded-full bg-white/12" />
          <span className="size-2.5 rounded-full bg-white/12" />
        </span>
        <span className="min-w-0 flex-1 truncate font-mono text-[11px] tracking-[0.02em] text-muted">{title}</span>
        {meta ? <span className="hidden shrink-0 font-mono text-[10.5px] text-subtle sm:block">{meta}</span> : null}
      </div>
      <div className={cn("relative overflow-hidden bg-[#0b0e12]", bodyClassName)}>{children}</div>
      {status ? (
        <div className="flex h-7 items-center gap-4 border-t border-line bg-surface-2/90 px-3.5 font-mono text-[10.5px] text-subtle">
          {status}
        </div>
      ) : null}
    </figure>
  );
}
