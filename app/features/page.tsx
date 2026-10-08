import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDownToLine, ArrowRight } from "lucide-react";
import { FeatureIndex } from "@/components/features/FeatureIndex";
import { FeatureSection } from "@/components/features/FeatureSection";
import { PlatformIcon } from "@/components/icons/PlatformIcons";
import { MotionReveal } from "@/components/motion/MotionReveal";
import { RevealText } from "@/components/motion/RevealText";
import { LinkButton } from "@/components/ui/Button";
import { Container, Eyebrow, TechnicalLabel } from "@/components/ui/primitives";
import { features } from "@/lib/content/features";
import { pageMetadata } from "@/lib/seo";
import { platforms, release, site } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Features — 2D Drafting, 3D Modeling, Assemblies and Automation",
  description: `What ${site.name} does: precise 2D drafting, parametric 3D modeling, large assemblies, physically based visualization, DWG and STEP exchange, multi-core performance and Python automation.`,
  path: "/features",
});

const facts = [
  { label: "Workspaces", value: "2D drafting · 3D modeling" },
  { label: "Exchange", value: "DWG · DXF · STEP · IGES · STL" },
  { label: "Platforms", value: platforms.map((p) => p.name).join(" · ") },
  { label: "Release", value: `${release.version} ${release.channel}` },
];

export default function FeaturesPage() {
  const indexItems = features.map(({ id, index, title }) => ({ id, index, title }));

  return (
    <>
      <section
        aria-labelledby="features-title"
        className="relative overflow-hidden pt-[calc(var(--nav-height)+64px)] pb-16 sm:pb-20 lg:pt-[calc(var(--nav-height)+96px)] lg:pb-28"
      >
        <div
          aria-hidden
          className="cad-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_70%_80%_at_30%_0%,#000,transparent)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 left-[10%] h-[420px] w-[620px] max-w-full rounded-full bg-[radial-gradient(closest-side,rgb(47_123_255/0.12),transparent)]"
        />
        <Container className="relative">
          <MotionReveal preset="fadeIn">
            <Eyebrow>Features</Eyebrow>
          </MotionReveal>
          <RevealText
            as="h1"
            id="features-title"
            onMount
            delay={0.05}
            lines={["Powerful features", "for modern engineering."]}
            className="mt-5 max-w-5xl text-[2.5rem] leading-[1.02] font-semibold tracking-[-0.04em] text-fg sm:text-6xl lg:text-[4.25rem]"
          />
          <div className="mt-8 grid gap-10 lg:mt-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-start lg:gap-20">
            <MotionReveal delay={0.2}>
              <p className="text-pretty max-w-xl text-base leading-relaxed text-muted sm:text-lg">
                Eight capabilities in one desktop application — from the first constrained sketch to an issued,
                revision-tracked drawing set. Every tool below ships in the same download.
              </p>
            </MotionReveal>

            <MotionReveal delay={0.28}>
              <dl className="divide-y divide-line border-y border-line">
                {facts.map((fact) => (
                  <div key={fact.label} className="grid grid-cols-[minmax(0,7rem)_minmax(0,1fr)] items-baseline gap-4 py-3">
                    <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-subtle">{fact.label}</dt>
                    <dd className="text-sm text-fg/90">{fact.value}</dd>
                  </div>
                ))}
              </dl>
            </MotionReveal>
          </div>
        </Container>
      </section>

      <div className="border-t border-line">
        <Container className="xl:grid xl:grid-cols-[180px_minmax(0,1fr)] xl:gap-16">
          <FeatureIndex items={indexItems} />
          <div>
            {features.map((feature, i) => (
              <FeatureSection key={feature.id} feature={feature} reverse={i % 2 === 1} />
            ))}
          </div>
        </Container>
      </div>

      <section
        aria-labelledby="features-cta-title"
        className="relative overflow-hidden border-t border-line py-24 sm:py-32"
      >
        <div
          aria-hidden
          className="cad-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_55%_70%_at_50%_100%,#000,transparent)]"
        />
        <Container className="relative flex flex-col items-center text-center">
          <MotionReveal>
            <TechnicalLabel tone="accent" className="uppercase tracking-[0.2em]">
              Version {release.version} · {release.channel}
            </TechnicalLabel>
          </MotionReveal>
          <MotionReveal delay={0.06}>
            <h2
              id="features-cta-title"
              className="mt-5 text-balance text-[2.25rem] leading-[1.05] font-semibold tracking-[-0.035em] text-fg sm:text-5xl lg:text-6xl"
            >
              Every feature, one installer.
            </h2>
          </MotionReveal>
          <MotionReveal delay={0.12}>
            <p className="mx-auto mt-5 max-w-xl text-base text-muted sm:text-lg">
              Download {site.name} for your workstation. Free for personal use; Professional licenses add commercial rights
              and automation.
            </p>
          </MotionReveal>
          <MotionReveal delay={0.18} className="mt-10 flex w-full flex-col items-center gap-6">
            <div className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center">
              <LinkButton href="/download" size="lg" trailingIcon={<ArrowDownToLine aria-hidden className="size-4" />}>
                Download {site.name}
              </LinkButton>
              <LinkButton
                href="/pricing"
                variant="secondary"
                size="lg"
                trailingIcon={<ArrowRight aria-hidden className="size-4" />}
              >
                Compare licenses
              </LinkButton>
            </div>
            <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted">
              {platforms.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/download?platform=${p.id}`}
                    className="inline-flex min-h-11 items-center gap-2 transition-colors hover:text-fg"
                  >
                    <PlatformIcon id={p.id} size={14} />
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </MotionReveal>
        </Container>
      </section>
    </>
  );
}
