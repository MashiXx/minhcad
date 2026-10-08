import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight, BookOpen, KeyRound, ScrollText, type LucideIcon } from "lucide-react";
import { DownloadVisual } from "@/components/download/DownloadVisual";
import { PlatformSelectorFromParams } from "@/components/download/PlatformSelector";
import { PlatformSelectorSkeleton } from "@/components/download/PlatformSelectorSkeleton";
import { ReleaseManifest } from "@/components/download/ReleaseManifest";
import { MotionReveal, RevealGroup, RevealItem } from "@/components/motion/MotionReveal";
import { RevealText } from "@/components/motion/RevealText";
import { Container, Eyebrow, TechnicalLabel } from "@/components/ui/primitives";
import { pageMetadata } from "@/lib/seo";
import { release, site } from "@/lib/site";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = pageMetadata({
  title: `Download ${site.name} for Windows, macOS and Ubuntu`,
  description: `Download ${site.name} ${release.version} for Windows 10/11 (x64, ARM64), macOS 13+ (Apple Silicon and Intel) and Ubuntu 22.04/24.04. Free for personal use.`,
  path: "/download",
});

const nextSteps: { icon: LucideIcon; title: string; body: string; href: string; cta: string }[] = [
  {
    icon: ScrollText,
    title: "Release notes",
    body: `What changed in ${release.version}, known issues and file checksums.`,
    href: release.notesHref,
    cta: "Read the notes",
  },
  {
    icon: BookOpen,
    title: "Installation guide",
    body: "Install, activate a license and open your first drawing.",
    href: "/docs",
    cta: "Open documentation",
  },
  {
    icon: KeyRound,
    title: "Licensing",
    body: "Personal is free for non-commercial work. Professional is licensed per seat.",
    href: "/pricing",
    cta: "Compare licenses",
  },
];

export default function DownloadPage() {
  return (
    <>
      <section
        aria-labelledby="download-title"
        className="relative overflow-hidden pt-[calc(var(--nav-height)+56px)] pb-20 sm:pb-24 lg:pt-[calc(var(--nav-height)+80px)]"
      >
        <div
          aria-hidden
          className="cad-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_70%_70%_at_25%_20%,#000,transparent)]"
        />
        <Container className="relative">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:grid-rows-[auto_1fr] lg:gap-x-14 xl:gap-x-20">
            <header className="lg:col-start-1 lg:row-start-1">
              <MotionReveal preset="fadeIn" className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <Eyebrow>Download</Eyebrow>
                <TechnicalLabel className="text-subtle">
                  v{release.version} · {release.channel} · {formatDate(release.date)}
                </TechnicalLabel>
              </MotionReveal>
              <RevealText
                as="h1"
                id="download-title"
                onMount
                delay={0.05}
                lines={["Download the", "CAD platform."]}
                className="mt-5 text-[2.5rem] leading-[1.02] font-semibold tracking-[-0.04em] text-fg sm:text-6xl lg:text-[3.5rem] xl:text-[4.25rem]"
              />
              <MotionReveal delay={0.2}>
                <p className="text-pretty mt-6 max-w-md text-base leading-relaxed text-muted sm:text-lg">
                  Native builds for Windows, macOS and Ubuntu. One installer per platform — free for personal use,
                  with Professional licenses activated in the same application.
                </p>
              </MotionReveal>
            </header>

            <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1">
              <MotionReveal preset="fadeUp" delay={0.1} amount={0.05}>
                <Suspense fallback={<PlatformSelectorSkeleton />}>
                  <PlatformSelectorFromParams />
                </Suspense>
              </MotionReveal>
            </div>

            <div className="lg:col-start-1 lg:row-start-2 lg:self-center">
              <DownloadVisual className="max-w-[340px] sm:max-w-[420px] lg:max-w-[460px]" />
            </div>
          </div>
        </Container>
      </section>

      <Container>
        <ReleaseManifest />
      </Container>

      <section aria-labelledby="next-steps-title" className="border-t border-line py-24 sm:py-28">
        <Container>
          <MotionReveal>
            <h2 id="next-steps-title" className="text-2xl font-semibold tracking-[-0.02em] text-fg sm:text-[28px]">
              After you download
            </h2>
          </MotionReveal>
          <RevealGroup as="ul" className="mt-10 grid gap-4 md:grid-cols-3">
            {nextSteps.map(({ icon: Icon, title, body, href, cta }) => (
              <RevealItem as="li" key={title}>
                <Link
                  href={href}
                  className="group flex h-full flex-col rounded-[14px] border border-line bg-surface-1/80 p-6 transition-[transform,border-color,background-color] duration-300 ease-[var(--ease-out-expo)] hover:-translate-y-1 hover:border-line-strong hover:bg-surface-2/80"
                >
                  <Icon aria-hidden className="size-5 text-accent-hover" strokeWidth={1.7} />
                  <span className="mt-5 text-[17px] font-semibold tracking-[-0.015em] text-fg">{title}</span>
                  <span className="mt-2 text-sm leading-relaxed text-muted">{body}</span>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-[13px] font-medium text-accent-hover">
                    {cta}
                    <ArrowRight aria-hidden className="size-3.5 transition-transform duration-200 group-hover:translate-x-[3px]" />
                  </span>
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </section>
    </>
  );
}
