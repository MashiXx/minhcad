import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Cpu, FileStack, Gauge, MonitorPlay } from "lucide-react";
import { CadViewport2D } from "@/components/cad/CadViewport2D";
import { ScreenshotFrame } from "@/components/cad/ScreenshotFrame";
import { ModelInspector } from "@/components/three/ModelInspector";
import { FeatureCard } from "./FeatureCard";
import { MotionReveal, RevealGroup, RevealItem } from "@/components/motion/MotionReveal";
import { DownloadPageButton } from "@/components/download/DownloadButton";
import { PlatformIcon } from "@/components/icons/PlatformIcons";
import { LinkButton } from "@/components/ui/Button";
import { Container, CornerMarks, Section, SectionHeader, TechnicalLabel } from "@/components/ui/primitives";
import { features } from "@/lib/content/features";
import { images, screenshots } from "@/lib/content/assets";
import { plans, platforms, release } from "@/lib/site";

export function Cad2DSection() {
  return (
    <Section id="drafting" aria-labelledby="drafting-title">
      <Container>
        <MotionReveal>
          <SectionHeader
            id="drafting-title"
            eyebrow="2D Drafting"
            title="Precision at every layer."
            description="Production drawings for civil, mechanical and architectural work — with layers, blocks and dimensions that behave the way engineers expect."
          />
        </MotionReveal>
        <div className="mt-14 lg:mt-20">
          <CadViewport2D />
        </div>
      </Container>
    </Section>
  );
}

export function ModelingSection() {
  return (
    <Section id="modeling" aria-labelledby="modeling-title" className="overflow-hidden">
      <div aria-hidden className="cad-grid pointer-events-none absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_45%,#000,transparent)]" />
      <Container className="relative">
        <MotionReveal>
          <SectionHeader
            id="modeling-title"
            eyebrow="3D Modeling"
            title="Model without limits."
            description="Inspect solids, surfaces and assemblies in real time. Switch view modes, orbit and read every edge — the same model, four ways."
          />
        </MotionReveal>
        <MotionReveal preset="scaleIn" className="mt-14 lg:mt-20">
          <ModelInspector />
        </MotionReveal>

        <div className="mt-16 grid items-center gap-10 lg:mt-24 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-16">
          <MotionReveal preset="image">
            <ScreenshotFrame title="fanuc-430-arm.dxf — KufCad" meta="Gouraud Shaded · 2 viewports">
              <Image
                src={screenshots.cad3d.src}
                alt={screenshots.cad3d.alt}
                width={screenshots.cad3d.width}
                height={screenshots.cad3d.height}
                sizes="(min-width: 1024px) 60vw, 100vw"
                className="h-auto w-full"
              />
            </ScreenshotFrame>
          </MotionReveal>
          <MotionReveal preset="right" delay={0.12}>
            <TechnicalLabel className="uppercase tracking-[0.16em] text-subtle">In the application</TechnicalLabel>
            <h3 className="mt-3 text-2xl font-semibold tracking-[-0.02em] text-fg sm:text-[28px]">
              The real workspace, not a render.
            </h3>
            <p className="mt-4 text-base leading-relaxed text-muted">
              The modelling ribbon gives you box, extrude, revolve, loft, sweep and press-pull, plus union, subtract and
              intersect. Split the view to compare orientations side by side.
            </p>
            <ul className="mt-6 grid grid-cols-2 gap-x-6 gap-y-2.5 text-sm text-fg/85">
              {["Extrude · Revolve", "Loft · Sweep", "Boolean operations", "Fillet · Chamfer", "Multiple viewports", "UCS and view cube"].map(
                (item) => (
                  <li key={item} className="flex items-center gap-2">
                    <Check aria-hidden className="size-3.5 text-accent-hover" />
                    {item}
                  </li>
                ),
              )}
            </ul>
          </MotionReveal>
        </div>
      </Container>
    </Section>
  );
}

export function CapabilitiesSection() {
  const shown = features.filter((f) =>
    ["2d-drafting", "3d-modeling", "assemblies", "visualization", "file-formats", "automation"].includes(f.id),
  );
  return (
    <Section aria-labelledby="capabilities-title" className="border-t border-line">
      <Container>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <MotionReveal>
            <SectionHeader
              id="capabilities-title"
              eyebrow="Engineering capabilities"
              title="Built for engineering."
              description="One desktop application from concept sketch to issued drawing set."
            />
          </MotionReveal>
          <MotionReveal delay={0.1}>
            <LinkButton href="/features" variant="secondary" trailingIcon={<ArrowRight aria-hidden className="size-4" />}>
              All features
            </LinkButton>
          </MotionReveal>
        </div>
        <RevealGroup as="ul" stagger={0.08} className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((f) => (
            <RevealItem as="li" key={f.id}>
              <FeatureCard feature={f} />
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </Section>
  );
}

const stats = [
  { icon: FileStack, value: "250,000+", label: "Entities per drawing", note: "at interactive frame rates" },
  { icon: MonitorPlay, value: "60 FPS", label: "Viewport target", note: "GPU-accelerated display" },
  { icon: Cpu, value: "All cores", label: "Regeneration", note: "multi-threaded rebuilds" },
  { icon: Gauge, value: "Streaming", label: "Large files", note: "open before fully loaded" },
];

export function PerformanceSection() {
  return (
    <Section aria-labelledby="performance-title" className="overflow-hidden border-t border-line bg-surface-1/30">
      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <MotionReveal>
              <SectionHeader
                id="performance-title"
                eyebrow="Performance"
                title="Fast where it matters."
                description="Large drawings and assemblies stay responsive. Pan, orbit and edit without waiting for the viewport to catch up."
              />
            </MotionReveal>
            <RevealGroup as="ul" stagger={0.08} className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-[14px] border border-line bg-line">
              {stats.map(({ icon: Icon, value, label, note }) => (
                <RevealItem as="li" key={label} className="bg-bg p-5 sm:p-6">
                  <Icon aria-hidden className="size-4 text-accent-hover" strokeWidth={1.7} />
                  <p className="mt-4 text-2xl font-semibold tracking-[-0.03em] text-fg sm:text-[28px]">{value}</p>
                  <p className="mt-1 text-sm text-fg/85">{label}</p>
                  <p className="mt-0.5 text-xs text-muted">{note}</p>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
          <MotionReveal preset="image" className="relative">
            <div className="relative aspect-[424/192] overflow-hidden rounded-[18px] border border-line-strong bg-[#0b0e12]">
              <Image
                src={images.carWireframe.src}
                alt={images.carWireframe.alt}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
              <CornerMarks className="m-3" />
              <div className="absolute bottom-3 left-3 flex gap-3 rounded-md bg-bg/75 px-2.5 py-1.5 backdrop-blur">
                <TechnicalLabel>Wireframe</TechnicalLabel>
                <TechnicalLabel tone="accent">GPU</TechnicalLabel>
              </div>
            </div>
          </MotionReveal>
        </div>
      </Container>
    </Section>
  );
}

export function CrossPlatformSection() {
  return (
    <Section aria-labelledby="platforms-title" className="border-t border-line">
      <Container>
        <MotionReveal>
          <SectionHeader
            id="platforms-title"
            align="center"
            eyebrow="Cross-platform"
            title="Available everywhere."
            description="Native builds for the desktop you already use. Files and licenses move with you."
          />
        </MotionReveal>
        <RevealGroup as="ul" stagger={0.1} className="mx-auto mt-14 grid max-w-4xl gap-4 sm:grid-cols-3">
          {platforms.map((p) => (
            <RevealItem as="li" key={p.id}>
              <Link
                href={`/download?platform=${p.id}`}
                className="group flex h-full flex-col items-center gap-4 rounded-[14px] border border-line bg-surface-1/80 px-6 py-9 text-center transition-[transform,border-color,background-color] duration-300 ease-[var(--ease-out-expo)] hover:-translate-y-1 hover:border-line-strong hover:bg-surface-2/80"
              >
                <PlatformIcon id={p.id} size={34} className="text-fg/90 transition-colors group-hover:text-fg" />
                <span className="text-lg font-semibold tracking-[-0.01em] text-fg">{p.name}</span>
                <TechnicalLabel className="text-center leading-relaxed">{p.shortRequirements}</TechnicalLabel>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </Section>
  );
}

export function PricingCTASection() {
  return (
    <Section aria-labelledby="pricing-cta-title" className="border-t border-line">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:items-center lg:gap-20">
          <MotionReveal>
            <SectionHeader
              id="pricing-cta-title"
              eyebrow="Licensing"
              title="Simple licensing."
              description="Free for personal use. One seat-based license for professional and commercial work."
            />
            <LinkButton
              href="/pricing"
              variant="secondary"
              className="mt-8"
              trailingIcon={<ArrowRight aria-hidden className="size-4" />}
            >
              Compare plans
            </LinkButton>
          </MotionReveal>
          <RevealGroup className="grid gap-4 sm:grid-cols-2">
            {plans.map((plan) => (
              <RevealItem key={plan.id}>
                <div
                  className={
                    plan.featured
                      ? "relative h-full rounded-[14px] border border-accent/40 bg-gradient-to-b from-accent/[0.08] to-surface-1 p-6"
                      : "relative h-full rounded-[14px] border border-line bg-surface-1/80 p-6"
                  }
                >
                  <p className="text-sm font-medium text-fg">{plan.name}</p>
                  <p className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-fg">{plan.price}</p>
                  <p className="mt-1 text-xs text-muted">{plan.priceNote}</p>
                  <ul className="mt-6 flex flex-col gap-2 text-sm text-fg/80">
                    {plan.highlights.slice(0, 3).map((h) => (
                      <li key={h} className="flex items-start gap-2">
                        <Check aria-hidden className="mt-0.5 size-3.5 shrink-0 text-accent-hover" />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Container>
    </Section>
  );
}

export function DownloadCTASection() {
  return (
    <section aria-labelledby="download-cta-title" className="relative overflow-hidden border-t border-line py-28 sm:py-36">
      <div aria-hidden className="cad-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_55%_70%_at_50%_100%,#000,transparent)]" />
      <div aria-hidden className="pointer-events-none absolute bottom-[-40%] left-1/2 h-[80%] w-[70%] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(47_123_255/0.18),transparent)]" />
      <Container className="relative flex flex-col items-center text-center">
        <MotionReveal>
          <TechnicalLabel tone="accent" className="uppercase tracking-[0.2em]">
            Version {release.version} · {release.channel}
          </TechnicalLabel>
        </MotionReveal>
        <MotionReveal delay={0.06}>
          <h2
            id="download-cta-title"
            className="mt-5 text-balance text-[2.5rem] leading-[1.02] font-semibold tracking-[-0.04em] text-fg sm:text-6xl lg:text-7xl"
          >
            Start designing today.
          </h2>
        </MotionReveal>
        <MotionReveal delay={0.12}>
          <p className="mx-auto mt-5 max-w-xl text-base text-muted sm:text-lg">
            Download KufCad and open your first drawing in minutes. Free for personal use.
          </p>
        </MotionReveal>
        <MotionReveal delay={0.18} className="mt-10 flex flex-col items-center gap-5">
          <DownloadPageButton platform="windows" />
          <div className="flex items-center gap-5 text-sm text-muted">
            {platforms
              .filter((p) => p.id !== "windows")
              .map((p) => (
                <Link
                  key={p.id}
                  href={`/download?platform=${p.id}`}
                  className="-my-3 inline-flex items-center gap-2 py-3 transition-colors hover:text-fg"
                >
                  <PlatformIcon id={p.id} size={14} />
                  {p.name}
                </Link>
              ))}
          </div>
        </MotionReveal>
      </Container>
    </section>
  );
}
