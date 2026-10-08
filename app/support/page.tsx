import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Clock,
  Cpu,
  Download,
  FileInput,
  Gauge,
  Headset,
  KeyRound,
  Mail,
  SquareTerminal,
  Users,
  type LucideIcon,
} from "lucide-react";
import { ScreenshotFrame } from "@/components/cad/ScreenshotFrame";
import { DocsSearch } from "@/components/docs/DocsSearch";
import { MotionReveal, RevealGroup, RevealItem } from "@/components/motion/MotionReveal";
import { RevealText } from "@/components/motion/RevealText";
import { AnchorLink } from "@/components/support/AnchorLink";
import { ContactForm } from "@/components/support/ContactForm";
import { Container, Eyebrow, Section, SectionHeader, TechnicalLabel } from "@/components/ui/primitives";
import { images } from "@/lib/content/assets";
import { getSearchIndex } from "@/lib/content/docs";
import { pageMetadata } from "@/lib/seo";
import { release, site } from "@/lib/site";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = pageMetadata({
  title: "Support — Help Center, Community and Contact",
  description:
    "Get help with KufCad: search the documentation, ask the community, or contact the support team about installation, licensing, file exchange and automation.",
  path: "/support",
});

const COMMUNITY_URL = "https://community.kufcad.com";
const STATUS_URL = "https://status.kufcad.com";

type Channel = {
  icon: LucideIcon;
  title: string;
  description: string;
  cta: string;
  href: string;
  kind: "internal" | "external" | "anchor";
};

const channels: Channel[] = [
  {
    icon: BookOpen,
    title: "Browse Help Center",
    description: "Tutorials, command reference and troubleshooting for every part of KufCad.",
    cta: "Open documentation",
    href: "/docs",
    kind: "internal",
  },
  {
    icon: Users,
    title: "Community",
    description: "Ask questions, share scripts and templates, and see how other teams work.",
    cta: "Visit the forum",
    href: COMMUNITY_URL,
    kind: "external",
  },
  {
    icon: Headset,
    title: "Contact Support",
    description: "Reach the engineers behind KufCad for technical, licensing and purchasing questions.",
    cta: "Send a message",
    href: "#contact",
    kind: "anchor",
  },
];

const topics: { icon: LucideIcon; label: string; description: string; href: string }[] = [
  {
    icon: Download,
    label: "Installation issues",
    description: "Blocked installers, missing dependencies",
    href: "/docs/troubleshooting#installation-fails",
  },
  {
    icon: KeyRound,
    label: "License activation",
    description: "Keys, seats and offline activation",
    href: "/docs/troubleshooting#license-activation",
  },
  {
    icon: Cpu,
    label: "System requirements",
    description: "Supported OS, GPU and memory",
    href: "/docs/installation#system-requirements",
  },
  {
    icon: FileInput,
    label: "File import/export",
    description: "DWG, STEP, STL and unit handling",
    href: "/docs/file-formats#import-and-export",
  },
  {
    icon: Gauge,
    label: "Performance",
    description: "Slow viewport or regeneration",
    href: "/docs/troubleshooting#performance",
  },
  {
    icon: SquareTerminal,
    label: "Scripting and automation",
    description: "Macros, Python API and headless mode",
    href: "/docs/automation",
  },
];

const responseTimes = [
  { plan: "Professional", detail: "Technical support", time: "1 business day" },
  { plan: "Licensing & sales", detail: "Purchasing, invoices, seats", time: "1 business day" },
  { plan: "Personal", detail: "Best-effort email support", time: "3 business days" },
];

const cardClass =
  "group relative flex h-full flex-col rounded-[14px] border border-line bg-surface-1/80 p-6 transition-[transform,border-color,background-color,box-shadow] duration-300 ease-[var(--ease-out-expo)] hover:-translate-y-1 hover:border-line-strong hover:bg-surface-2/80 hover:shadow-[0_24px_48px_-28px_rgb(0_0_0/0.9)] sm:p-7";

function ChannelCard({ channel }: { channel: Channel }) {
  const Icon = channel.icon;
  const content = (
    <>
      <span className="flex size-10 items-center justify-center rounded-[10px] border border-line-strong bg-white/[0.03] text-accent-hover">
        <Icon aria-hidden className="size-[18px]" strokeWidth={1.7} />
      </span>
      <span className="mt-6 text-lg font-semibold tracking-[-0.015em] text-fg">{channel.title}</span>
      <span className="mt-2 text-[15px] leading-relaxed text-muted">{channel.description}</span>
      <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-medium text-accent-hover">
        {channel.cta}
        {channel.kind === "external" ? (
          <ArrowUpRight aria-hidden className="size-4 transition-transform duration-200 group-hover:-translate-y-px group-hover:translate-x-px" />
        ) : (
          <ArrowRight aria-hidden className="size-4 transition-transform duration-200 group-hover:translate-x-[3px]" />
        )}
        {channel.kind === "external" ? <span className="sr-only"> (opens in a new tab)</span> : null}
      </span>
    </>
  );
  if (channel.kind === "anchor") {
    return (
      <AnchorLink href="#contact" className={cardClass}>
        {content}
      </AnchorLink>
    );
  }
  if (channel.kind === "external") {
    return (
      <a href={channel.href} target="_blank" rel="noopener noreferrer" className={cardClass}>
        {content}
      </a>
    );
  }
  return (
    <Link href={channel.href} className={cardClass}>
      {content}
    </Link>
  );
}

export default function SupportPage() {
  const index = getSearchIndex();
  const suggestions = topics
    .map((t) => index.find((e) => e.href === t.href))
    .filter((e): e is NonNullable<typeof e> => e !== undefined);

  return (
    <>
      {/* Hero */}
      <section aria-labelledby="support-title" className="relative pb-16 pt-[calc(var(--nav-height)+56px)] sm:pb-20 lg:pt-[calc(var(--nav-height)+80px)]">
        <div
          aria-hidden
          className="cad-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_70%_60%_at_70%_30%,#000,transparent)]"
        />
        <Container className="relative">
          <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-16">
            <div>
              <MotionReveal preset="fadeIn">
                <Eyebrow>Support</Eyebrow>
              </MotionReveal>
              <RevealText
                as="h1"
                id="support-title"
                onMount
                lines={["We're here", "to help."]}
                className="mt-5 text-[2.75rem] font-semibold leading-[1.02] tracking-[-0.04em] text-fg sm:text-6xl lg:text-[4.25rem]"
              />
              <MotionReveal delay={0.15}>
                <p className="mt-6 max-w-[520px] text-pretty text-base leading-relaxed text-muted sm:text-lg">
                  Documentation for every tool, a community of KufCad users, and direct access to the engineers who
                  build the product. Most questions are answered within one business day.
                </p>
              </MotionReveal>
            </div>
            <MotionReveal preset="image" delay={0.1}>
              <ScreenshotFrame
                title="robot-cell-layout.kca — KufCad"
                meta="Model tree · Shaded"
                status={
                  <>
                    <span>X 1240.00</span>
                    <span>Y 860.00</span>
                    <span className="text-accent-hover">Z 0.00</span>
                  </>
                }
              >
                <Image
                  src={images.robotViewport.src}
                  alt={images.robotViewport.alt}
                  width={images.robotViewport.width}
                  height={images.robotViewport.height}
                  sizes="(min-width: 1024px) 600px, 100vw"
                  loading="eager"
                  className="h-auto w-full"
                />
              </ScreenshotFrame>
            </MotionReveal>
          </div>

          <MotionReveal delay={0.2} className="relative z-20 mt-14 lg:mt-16">
            <DocsSearch
              entries={index}
              suggestions={suggestions}
              size="lg"
              label="Search the help center"
              placeholder="Search the help center — try “activation” or “STEP”"
            />
          </MotionReveal>
        </Container>
      </section>

      {/* Channels */}
      <section aria-label="Support channels" className="pb-20 sm:pb-24">
        <Container>
          <RevealGroup as="ul" stagger={0.08} className="grid gap-4 md:grid-cols-3">
            {channels.map((channel) => (
              <RevealItem as="li" key={channel.title}>
                <ChannelCard channel={channel} />
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </section>

      {/* Popular topics */}
      <section aria-labelledby="topics-title" className="border-t border-line py-20 sm:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-16">
            <div>
              <MotionReveal>
                <h2 id="topics-title" className="text-2xl font-semibold tracking-[-0.025em] text-fg sm:text-[32px]">
                  Popular topics
                </h2>
                <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-muted">
                  The questions we answer most often, each linked to the relevant section of the documentation.
                </p>
              </MotionReveal>
              <RevealGroup as="ul" stagger={0.06} className="mt-8 grid gap-3 sm:grid-cols-2">
                {topics.map(({ icon: Icon, label, description, href }) => (
                  <RevealItem as="li" key={label}>
                    <Link
                      href={href}
                      className="group flex min-h-[72px] items-center gap-4 rounded-[12px] border border-line bg-surface-1/60 px-4 py-3.5 transition-[transform,border-color,background-color] duration-300 ease-[var(--ease-out-expo)] hover:-translate-y-0.5 hover:border-line-strong hover:bg-surface-2/70"
                    >
                      <Icon aria-hidden className="size-[18px] shrink-0 text-muted transition-colors group-hover:text-accent-hover" strokeWidth={1.7} />
                      <span className="min-w-0 flex-1">
                        <span className="block text-[15px] font-medium text-fg">{label}</span>
                        <span className="block text-[13px] text-muted">{description}</span>
                      </span>
                      <ArrowRight
                        aria-hidden
                        className="size-4 shrink-0 text-subtle transition-[color,transform] duration-200 group-hover:translate-x-[3px] group-hover:text-accent-hover"
                      />
                    </Link>
                  </RevealItem>
                ))}
              </RevealGroup>
            </div>

            <MotionReveal preset="fadeIn" delay={0.1} className="self-start">
              <aside className="rounded-[14px] border border-line bg-surface-1/70 p-6" aria-labelledby="release-title">
                <TechnicalLabel className="uppercase tracking-[0.16em] text-subtle">Current release</TechnicalLabel>
                <p id="release-title" className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-fg">
                  {release.version}
                </p>
                <p className="mt-1 text-sm text-muted">
                  {release.channel} · Released {formatDate(release.date)}
                </p>
                <p className="mt-4 text-[13px] leading-relaxed text-muted">
                  Before reporting a problem, check that you are on the latest version: <span className="text-fg/85">Help → Check for Updates</span>.
                </p>
                <div className="mt-5 flex flex-col gap-1 border-t border-line pt-4 text-sm">
                  <Link href={release.notesHref} className="inline-flex min-h-10 items-center justify-between text-fg/85 transition-colors hover:text-fg">
                    Release notes
                    <ArrowRight aria-hidden className="size-4 text-subtle" />
                  </Link>
                  <a
                    href={STATUS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-10 items-center justify-between text-fg/85 transition-colors hover:text-fg"
                  >
                    <span>
                      Service status
                      <span className="sr-only"> (opens in a new tab)</span>
                    </span>
                    <ArrowUpRight aria-hidden className="size-4 text-subtle" />
                  </a>
                </div>
              </aside>
            </MotionReveal>
          </div>
        </Container>
      </section>

      {/* Contact */}
      <Section
        id="contact"
        aria-labelledby="contact-title"
        className="scroll-mt-[calc(var(--nav-height)+8px)] border-t border-line bg-surface-1/30 focus:outline-none"
      >
        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-20">
            <div>
              <MotionReveal>
                <SectionHeader
                  id="contact-title"
                  eyebrow="Contact support"
                  title="Talk to an engineer."
                  description="Technical questions, licensing and purchasing go to the same team. Tell us what you are working on and we will get back to you by email."
                />
              </MotionReveal>

              <MotionReveal delay={0.08} className="mt-10 flex flex-col gap-6">
                <a
                  href={`mailto:${site.supportEmail}`}
                  className="group flex items-center gap-4 rounded-[12px] border border-line bg-bg/60 p-4 transition-[border-color,background-color] duration-200 hover:border-line-strong hover:bg-surface-1"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-[10px] border border-line-strong bg-white/[0.03] text-accent-hover">
                    <Mail aria-hidden className="size-[18px]" strokeWidth={1.7} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs text-muted">Email</span>
                    <span className="block truncate text-[15px] font-medium text-fg transition-colors group-hover:text-accent-hover">
                      {site.supportEmail}
                    </span>
                  </span>
                </a>

                <div>
                  <h3 className="flex items-center gap-2 text-sm font-medium text-fg">
                    <Clock aria-hidden className="size-4 text-muted" strokeWidth={1.7} />
                    Response times
                  </h3>
                  <dl className="mt-3 divide-y divide-line overflow-hidden rounded-[12px] border border-line">
                    {responseTimes.map((r) => (
                      <div key={r.plan} className="flex items-center justify-between gap-4 bg-bg/40 px-4 py-3">
                        <dt className="min-w-0">
                          <span className="block text-sm text-fg">{r.plan}</span>
                          <span className="block text-xs text-muted">{r.detail}</span>
                        </dt>
                        <dd className="shrink-0 font-mono text-[12px] text-accent-hover">{r.time}</dd>
                      </div>
                    ))}
                  </dl>
                  <p className="mt-3 text-[13px] leading-relaxed text-muted">
                    Monday to Friday, 08:00–18:00 UTC. Response times are for the first reply; complex issues may need
                    a support bundle (<span className="text-fg/85">Help → Create Support Bundle</span>).
                  </p>
                </div>
              </MotionReveal>
            </div>

            <MotionReveal delay={0.1}>
              <div className="rounded-[16px] border border-line bg-bg/70 p-5 sm:p-8">
                <h3 className="text-lg font-semibold tracking-[-0.015em] text-fg">Send a message</h3>
                <p className="mt-1.5 text-sm text-muted">
                  To buy Professional seats, choose <span className="text-fg/85">Buy a Professional license</span> and
                  include the number of seats.
                </p>
                <div className="mt-6">
                  <ContactForm email={site.supportEmail} />
                </div>
              </div>
            </MotionReveal>
          </div>
        </Container>
      </Section>
    </>
  );
}
