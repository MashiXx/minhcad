import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, CircleCheck, Crosshair, ShieldCheck } from "lucide-react";
import { ScreenshotFrame } from "@/components/cad/ScreenshotFrame";
import { PlatformIcon } from "@/components/icons/PlatformIcons";
import { MotionReveal, RevealGroup, RevealItem } from "@/components/motion/MotionReveal";
import { RevealText } from "@/components/motion/RevealText";
import { LinkButton } from "@/components/ui/Button";
import { Container, CornerMarks, Eyebrow, Section, SectionHeader, TechnicalLabel } from "@/components/ui/primitives";
import { images, screenshots } from "@/lib/content/assets";
import { jsonLd, pageMetadata } from "@/lib/seo";
import { platforms, site } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "About — Professional Tools for Engineers, Designers and Creators",
  description:
    "KufCad builds professional CAD software for engineers, designers and creators: precise geometry, open formats and dependable performance on Windows, macOS and Ubuntu.",
  path: "/about",
});

const principles = [
  {
    title: "Engineering first",
    text: "Features earn their place by solving real drafting and modeling problems. We test them against production drawings, not demos.",
  },
  {
    title: "Transparent by design",
    text: "Documented formats, readable data and predictable behaviour. Your files stay yours, in formats other tools can open.",
  },
  {
    title: "Performance you can count on",
    text: "Large drawings and assemblies stay responsive. A viewport that keeps up is a requirement, not a feature.",
  },
  {
    title: "Built with the people who use it",
    text: "The roadmap is shaped in the forum, in support conversations and in public betas — by people who use KufCad every day.",
  },
];

const qualities = [
  {
    icon: Crosshair,
    title: "Precise geometry",
    text: "Coordinates are stored in double precision with 16 significant digits, from a 3 mm washer to a 3 km interchange.",
  },
  {
    icon: ShieldCheck,
    title: "Reliable data",
    text: "DWG and STEP files are round-tripped against reference sets so geometry, layers and units arrive intact.",
  },
  {
    icon: CircleCheck,
    title: "Tested rigorously",
    text: "Every build runs the same regression suite of drawings and models on Windows, macOS and Ubuntu before release.",
  },
];

const communityLinks = [
  { label: "Community forum", href: "https://community.kufcad.com" },
  ...site.social.filter((s) => s.label === "GitHub" || s.label === "YouTube"),
];

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  url: site.url,
  email: site.supportEmail,
  description: "Professional tools for engineers, designers and creators.",
  sameAs: site.social.map((s) => s.href),
};

export default function AboutPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(structuredData)} />

      {/* Hero */}
      <section aria-labelledby="about-title" className="relative overflow-hidden pb-20 pt-[calc(var(--nav-height)+56px)] sm:pb-24 lg:pt-[calc(var(--nav-height)+88px)]">
        <div
          aria-hidden
          className="cad-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_65%_60%_at_75%_35%,#000,transparent)]"
        />
        <Container className="relative">
          <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-16">
            <div>
              <MotionReveal preset="fadeIn">
                <Eyebrow>About KufCad</Eyebrow>
              </MotionReveal>
              <RevealText
                as="h1"
                id="about-title"
                onMount
                lines={["Professional tools for", "engineers, designers", "and creators."]}
                className="mt-5 text-[2.5rem] font-semibold leading-[1.04] tracking-[-0.04em] text-fg sm:text-[3.5rem] lg:text-[3.25rem] xl:text-[3.75rem]"
              />
              <MotionReveal delay={0.2}>
                <p className="mt-6 max-w-[540px] text-pretty text-base leading-relaxed text-muted sm:text-lg">
                  KufCad is a desktop CAD application for 2D drafting, 3D modeling and engineering drawings. We build it for
                  people whose drawings get manufactured, permitted and built — where a dimension has to be right the first
                  time.
                </p>
              </MotionReveal>
              <MotionReveal delay={0.28}>
                <ul aria-label="Supported platforms" className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3">
                  {platforms.map((p) => (
                    <li key={p.id} className="flex items-center gap-2.5 text-sm text-fg/85">
                      <PlatformIcon id={p.id} size={16} className="text-fg/80" />
                      {p.name}
                    </li>
                  ))}
                </ul>
              </MotionReveal>
            </div>

            <MotionReveal preset="image" delay={0.1}>
              <div className="relative mx-auto aspect-[652/640] w-full max-w-[560px] overflow-hidden rounded-[18px] border border-line-strong bg-[#0b0e12]">
                <Image
                  src={images.robotAbout.src}
                  alt={images.robotAbout.alt}
                  fill
                  loading="eager"
                  sizes="(min-width: 1024px) 560px, 100vw"
                  className="object-cover"
                />
                <CornerMarks className="m-3" />
                <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-3 rounded-md bg-bg/75 px-3 py-2 backdrop-blur">
                  <TechnicalLabel>6-axis arm · 42 parts</TechnicalLabel>
                  <TechnicalLabel tone="accent">Shaded</TechnicalLabel>
                </div>
              </div>
            </MotionReveal>
          </div>
        </Container>
      </section>

      {/* Mission */}
      <Section id="mission" aria-labelledby="mission-title" className="border-t border-line">
        <Container>
          <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] lg:gap-20">
            <div>
              <MotionReveal>
                <SectionHeader
                  id="mission-title"
                  eyebrow="Mission"
                  title="Make precise work feel direct."
                  description="Engineering software should be exact, fast and predictable — then get out of the way."
                />
              </MotionReveal>
              <MotionReveal delay={0.08}>
                <div className="mt-8 flex max-w-xl flex-col gap-4 text-[15px] leading-relaxed text-muted sm:text-base">
                  <p>
                    We started KufCad because the tools we used every day had become slow, closed and expensive to own.
                    Drawings took longer to open than to check. Files were locked into formats nobody else could read.
                  </p>
                  <p>
                    Our goal is a single application that covers the work from first sketch to issued drawing set, runs
                    natively on the operating system you already use, and treats your data as yours.
                  </p>
                </div>
              </MotionReveal>
            </div>
            <MotionReveal preset="image" delay={0.1}>
              <ScreenshotFrame title="interchange-site-plan.dwg — KufCad" meta="Model · 1:1000">
                <Image
                  src={screenshots.cad2d.src}
                  alt={screenshots.cad2d.alt}
                  width={screenshots.cad2d.width}
                  height={screenshots.cad2d.height}
                  sizes="(min-width: 1024px) 680px, 100vw"
                  className="h-auto w-full"
                />
              </ScreenshotFrame>
            </MotionReveal>
          </div>
        </Container>
      </Section>

      {/* Philosophy */}
      <Section id="philosophy" aria-labelledby="philosophy-title" className="border-t border-line bg-surface-1/30">
        <Container>
          <MotionReveal>
            <SectionHeader
              id="philosophy-title"
              eyebrow="Product philosophy"
              title="Design with intent. Deliver with integrity."
              description="Four principles decide what goes into each release — and what stays out."
            />
          </MotionReveal>
          <RevealGroup as="ol" stagger={0.1} className="mt-16 grid gap-10 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4 lg:gap-8">
            {principles.map((p, i) => (
              <RevealItem as="li" key={p.title} className="relative border-t border-line-strong pt-8">
                <span aria-hidden className="absolute -top-[4.5px] left-0 size-2 rounded-full bg-accent shadow-[0_0_0_4px_rgb(47_123_255/0.15)]" />
                <TechnicalLabel tone="accent" className="text-[13px] tracking-[0.12em]">
                  {String(i + 1).padStart(2, "0")}
                </TechnicalLabel>
                <h3 className="mt-4 text-lg font-semibold tracking-[-0.015em] text-fg">{p.title}</h3>
                <p className="mt-2.5 text-[15px] leading-relaxed text-muted">{p.text}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </Section>

      {/* Engineering */}
      <Section id="engineering" aria-labelledby="engineering-title" className="border-t border-line">
        <Container>
          <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
            <MotionReveal preset="image">
              <div className="relative aspect-[520/386] overflow-hidden rounded-[18px] border border-line-strong bg-[#0b0e12]">
                <Image
                  src={images.measurementPhoto.src}
                  alt={images.measurementPhoto.alt}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
                <CornerMarks className="m-3" />
                <div className="absolute bottom-3 left-3 flex gap-3 rounded-md bg-bg/75 px-2.5 py-1.5 backdrop-blur">
                  <TechnicalLabel>Tolerance</TechnicalLabel>
                  <TechnicalLabel tone="accent">±0.01 mm</TechnicalLabel>
                </div>
              </div>
            </MotionReveal>
            <div>
              <MotionReveal>
                <SectionHeader
                  id="engineering-title"
                  eyebrow="Engineering"
                  title="Accuracy you can build on."
                  description="A drawing is a contract with the shop floor. We treat geometric accuracy and data integrity as the foundation, not a feature list."
                />
              </MotionReveal>
              <RevealGroup as="ul" stagger={0.08} className="mt-10 flex flex-col gap-6">
                {qualities.map(({ icon: Icon, title, text }) => (
                  <RevealItem as="li" key={title} className="flex gap-4">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-[10px] border border-line-strong bg-white/[0.03] text-accent-hover">
                      <Icon aria-hidden className="size-[18px]" strokeWidth={1.7} />
                    </span>
                    <span>
                      <span className="block text-[15px] font-medium text-fg">{title}</span>
                      <span className="mt-1 block text-[15px] leading-relaxed text-muted">{text}</span>
                    </span>
                  </RevealItem>
                ))}
              </RevealGroup>
            </div>
          </div>

          <MotionReveal preset="image" className="mt-20 lg:mt-28">
            <ScreenshotFrame
              title="fanuc-430-arm.dxf — KufCad"
              meta="Gouraud Shaded · 2 viewports"
              status={
                <>
                  <span>Windows · macOS · Ubuntu</span>
                  <span className="hidden sm:inline">Same build, same results</span>
                </>
              }
            >
              <Image
                src={screenshots.cad3d.src}
                alt={screenshots.cad3d.alt}
                width={screenshots.cad3d.width}
                height={screenshots.cad3d.height}
                sizes="(min-width: 1240px) 1180px, 100vw"
                className="h-auto w-full"
              />
            </ScreenshotFrame>
          </MotionReveal>
        </Container>
      </Section>

      {/* Community */}
      <Section id="community" aria-labelledby="community-title" className="border-t border-line bg-surface-1/30">
        <Container>
          <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-20">
            <div>
              <MotionReveal>
                <SectionHeader
                  id="community-title"
                  eyebrow="Community"
                  title="Share knowledge. Ship better."
                  description="Engineers, studios and students use KufCad around the world. The forum is where scripts, templates and answers get shared — and where we hear what to build next."
                />
              </MotionReveal>
              <MotionReveal delay={0.08}>
                <ul className="mt-10 flex flex-col divide-y divide-line border-y border-line">
                  {communityLinks.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex min-h-14 items-center justify-between gap-4 text-[15px] text-fg/85 transition-colors hover:text-fg"
                      >
                        <span>
                          {link.label}
                          <span className="sr-only"> (opens in a new tab)</span>
                        </span>
                        <ArrowUpRight
                          aria-hidden
                          className="size-4 text-subtle transition-[color,transform] duration-200 group-hover:-translate-y-px group-hover:translate-x-px group-hover:text-accent-hover"
                        />
                      </a>
                    </li>
                  ))}
                </ul>
              </MotionReveal>
            </div>
            <MotionReveal preset="image" delay={0.1}>
              <div className="relative aspect-[490/322] overflow-hidden rounded-[18px] border border-line-strong bg-[#0b0e12]">
                <Image
                  src={images.aboutMap.src}
                  alt={images.aboutMap.alt}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
                <CornerMarks className="m-3" />
              </div>
            </MotionReveal>
          </div>
        </Container>
      </Section>

      {/* Closing */}
      <section aria-labelledby="about-cta-title" className="relative overflow-hidden border-t border-line py-24 sm:py-32">
        <div
          aria-hidden
          className="cad-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_55%_70%_at_50%_100%,#000,transparent)]"
        />
        <Container className="relative flex flex-col items-center text-center">
          <MotionReveal>
            <h2
              id="about-cta-title"
              className="text-balance text-[2.25rem] font-semibold leading-[1.05] tracking-[-0.035em] text-fg sm:text-5xl"
            >
              See it in your own work.
            </h2>
          </MotionReveal>
          <MotionReveal delay={0.08}>
            <p className="mx-auto mt-5 max-w-lg text-base text-muted sm:text-lg">
              The Personal edition is free. Open a drawing you already have and judge KufCad on real geometry.
            </p>
          </MotionReveal>
          <MotionReveal delay={0.16} className="mt-9 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
            <LinkButton href="/download" size="lg" className="w-full sm:w-auto" trailingIcon={<ArrowRight aria-hidden className="size-4" />}>
              Download KufCad
            </LinkButton>
            <LinkButton href="/docs" variant="secondary" size="lg" className="w-full sm:w-auto">
              Read the documentation
            </LinkButton>
          </MotionReveal>
        </Container>
      </section>
    </>
  );
}
