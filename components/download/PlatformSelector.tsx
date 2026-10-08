"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { ArrowRight, Cpu, Gpu, HardDrive, Info, MemoryStick, Monitor, type LucideIcon } from "lucide-react";
import { DownloadFileButton } from "@/components/download/DownloadButton";
import { PlatformIcon } from "@/components/icons/PlatformIcons";
import { Badge, TechnicalLabel } from "@/components/ui/primitives";
import { duration, ease, spring } from "@/lib/motion/tokens";
import { getPlatform, platforms, release, site, type Platform, type PlatformId } from "@/lib/site";
import { cn, formatDate } from "@/lib/utils";
import { isPlatformId, useDetectedPlatform } from "./usePlatformDetection";

const requirementIcons: Record<string, LucideIcon> = {
  "Operating system": Monitor,
  Processor: Cpu,
  Memory: MemoryStick,
  Graphics: Gpu,
  Storage: HardDrive,
};

/** Reads `?platform=` and renders the selector. Must sit inside <Suspense>. */
export function PlatformSelectorFromParams() {
  const params = useSearchParams();
  const raw = params.get("platform");
  return <PlatformSelector requested={isPlatformId(raw) ? raw : null} />;
}

/**
 * Accessible platform tabs (Windows / macOS / Ubuntu) with an animated
 * indicator. Only the panel content transitions — opacity, scale and height.
 * Precedence: user choice → `?platform=` → detected OS → Windows.
 */
export function PlatformSelector({ requested }: { requested: PlatformId | null }) {
  const detected = useDetectedPlatform();
  const reduce = useReducedMotion();
  const baseId = useId();
  const tabRefs = useRef<Partial<Record<PlatformId, HTMLButtonElement | null>>>({});

  const [chosen, setChosen] = useState<PlatformId | null>(null);
  // A new ?platform= (e.g. a link elsewhere on the site) wins over an earlier choice.
  const [lastRequested, setLastRequested] = useState(requested);
  if (requested !== lastRequested) {
    setLastRequested(requested);
    setChosen(null);
  }

  const active = chosen ?? requested ?? detected ?? "windows";
  const platform = getPlatform(active);
  const panelId = `${baseId}-panel`;
  const tabId = (id: PlatformId) => `${baseId}-tab-${id}`;

  // Height follows the measured panel content so switching never jumps.
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | "auto">("auto");
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const observer = new ResizeObserver(() => setHeight(el.offsetHeight));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  function select(id: PlatformId, focus = false) {
    setChosen(id);
    if (focus) tabRefs.current[id]?.focus();
    if (id === active) return;
    // Keep the URL shareable without a navigation or scroll jump.
    const url = new URL(window.location.href);
    url.searchParams.set("platform", id);
    window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const count = platforms.length;
    const current = platforms.findIndex((p) => p.id === active);
    let next: number;
    switch (event.key) {
      case "ArrowRight":
        next = (current + 1) % count;
        break;
      case "ArrowLeft":
        next = (current - 1 + count) % count;
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = count - 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    select(platforms[next].id, true);
  }

  const panelTransition = reduce ? { duration: 0 } : { duration: duration.micro, ease: ease.out };

  return (
    <div className="relative overflow-hidden rounded-[16px] border border-line-strong bg-surface-1/90 shadow-[0_40px_120px_-48px_rgb(0_0_0/0.95)]">
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-accent/70 to-transparent"
      />
      <div className="border-b border-line p-2 sm:p-3">
        <div
          role="tablist"
          aria-label="Operating system"
          onKeyDown={onKeyDown}
          className="grid grid-cols-3 gap-1 rounded-[12px] bg-bg/70 p-1"
        >
          {platforms.map((p) => {
            const selected = p.id === active;
            return (
              <button
                key={p.id}
                ref={(node) => {
                  tabRefs.current[p.id] = node;
                }}
                type="button"
                role="tab"
                id={tabId(p.id)}
                aria-selected={selected}
                aria-controls={panelId}
                tabIndex={selected ? 0 : -1}
                onClick={() => select(p.id)}
                className={cn(
                  "relative flex min-h-11 items-center justify-center rounded-[9px] px-2 text-sm font-medium transition-colors duration-200",
                  selected ? "text-fg" : "text-muted hover:text-fg",
                )}
              >
                {selected ? (
                  <motion.span
                    layoutId={`${baseId}-indicator`}
                    aria-hidden
                    transition={reduce ? { duration: 0 } : spring.ui}
                    className="absolute inset-0 rounded-[9px] border border-line-strong bg-surface-3 shadow-[0_8px_20px_-12px_rgb(0_0_0/0.9)]"
                  />
                ) : null}
                <span className="relative flex items-center gap-2">
                  <PlatformIcon id={p.id} size={16} />
                  {p.name}
                  {detected === p.id ? (
                    <>
                      <span aria-hidden className="size-1.5 rounded-full bg-accent-hover" />
                      <span className="sr-only">(detected on this device)</span>
                    </>
                  ) : null}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <motion.div
        initial={false}
        animate={{ height }}
        transition={reduce ? { duration: 0 } : { duration: duration.normal, ease: ease.out }}
        className="overflow-hidden"
      >
        <div ref={contentRef}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active}
              role="tabpanel"
              id={panelId}
              aria-labelledby={tabId(active)}
              initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.985 }}
              animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.985 }}
              transition={panelTransition}
              style={{ transformOrigin: "50% 0%" }}
            >
              <PlatformPanel platform={platform} isDetected={detected === active} />
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

function PlatformPanel({ platform, isDetected }: { platform: Platform; isDetected: boolean }) {
  const [primary] = platform.files;
  const architectures = Array.from(new Set(platform.files.map((f) => f.architecture))).join(" · ");
  const stats = [
    { label: "Version", value: release.version, note: `${release.channel} release` },
    { label: "Released", value: formatDate(release.date), note: "Latest" },
    { label: "Architecture", value: architectures, note: platform.id === "macos" ? "Universal binary" : "64-bit" },
    { label: "File size", value: primary.size, note: primary.label },
  ];

  return (
    <>
      <div className="p-5 sm:p-7">
        <div className="flex items-start gap-4">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-[10px] border border-line bg-surface-2 text-fg">
            <PlatformIcon id={platform.id} size={22} />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-semibold tracking-[-0.02em] text-fg sm:text-[22px]">
              {site.name} for {platform.name}
            </h2>
            <TechnicalLabel className="mt-2 block leading-relaxed">{platform.shortRequirements}</TechnicalLabel>
          </div>
          {isDetected ? (
            <Badge tone="accent" className="hidden shrink-0 sm:inline-flex">
              This device
            </Badge>
          ) : null}
        </div>

        <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-[12px] border border-line bg-line sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col bg-surface-1 p-4">
              <dt className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-subtle">{s.label}</dt>
              <dd className="mt-2 text-[15px] font-medium leading-snug tracking-[-0.01em] text-fg">{s.value}</dd>
              <dd className="mt-1 text-xs text-muted">{s.note}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-6">
          <DownloadFileButton platform={platform.id} file={primary} size="lg" className="w-full" />
          <p className="mt-3 text-center font-mono text-[11px] break-all text-subtle">
            {primary.fileName} · {primary.size}
          </p>
          <p className="mt-4 text-center text-xs leading-relaxed text-muted">
            By downloading, you agree to the{" "}
            <Link href="/terms" className="text-accent-hover underline-offset-4 hover:underline">
              License Agreement
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-accent-hover underline-offset-4 hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>

      <div className="border-t border-line p-5 sm:p-7">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="text-sm font-semibold text-fg">All files for {platform.name}</h3>
          <TechnicalLabel>
            {platform.files.length} {platform.files.length === 1 ? "file" : "files"}
          </TechnicalLabel>
        </div>
        <ul className="mt-3 divide-y divide-line">
          {platform.files.map((file) => (
            <li key={file.fileName} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
              <div className="min-w-0">
                <p className="font-mono text-[12px] break-all text-fg/90">{file.fileName}</p>
                <TechnicalLabel className="mt-1.5 block">
                  {file.architecture} · {file.size}
                </TechnicalLabel>
              </div>
              <DownloadFileButton
                platform={platform.id}
                file={file}
                variant="secondary"
                size="sm"
                label={`Download ${file.label}`}
                className="w-full shrink-0 sm:w-auto"
              />
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t border-line p-5 sm:p-7">
        <h3 className="text-sm font-semibold text-fg">System requirements</h3>
        <dl className="mt-3 divide-y divide-line">
          {platform.requirements.map((req) => {
            const Icon = requirementIcons[req.label] ?? Info;
            return (
              <div key={req.label} className="grid grid-cols-[1.25rem_minmax(0,1fr)] gap-x-3 gap-y-1 py-3 sm:grid-cols-[1.25rem_9rem_minmax(0,1fr)] sm:items-center">
                <Icon aria-hidden className="mt-0.5 size-4 text-muted sm:mt-0" strokeWidth={1.7} />
                <dt className="text-sm text-muted">{req.label}</dt>
                <dd className="col-start-2 text-sm text-fg/90 sm:col-start-auto">{req.value}</dd>
              </div>
            );
          })}
        </dl>
      </div>

      <div className="flex flex-col gap-1 border-t border-line px-5 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-7">
        <Link
          href={release.notesHref}
          className="group inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-accent-hover"
        >
          Release notes for {release.version}
          <ArrowRight aria-hidden className="size-3.5 transition-transform duration-200 group-hover:translate-x-[3px]" />
        </Link>
        <a href="#verify" className="inline-flex min-h-11 items-center text-sm text-muted transition-colors hover:text-fg">
          Verify your download
        </a>
      </div>
    </>
  );
}
