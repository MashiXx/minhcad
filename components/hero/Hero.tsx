"use client";

import { useCallback, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { HeroBackground } from "./HeroBackground";
import { HeroOverlay } from "./HeroOverlay";
import { RevealText } from "@/components/motion/RevealText";
import { RobotViewer } from "@/components/three/RobotViewer";
import type { RobotStats } from "@/components/three/RobotScene";
import { DownloadPageButton } from "@/components/download/DownloadButton";
import { LinkButton } from "@/components/ui/Button";
import { Badge, Container, TechnicalLabel } from "@/components/ui/primitives";
import { PlatformIcon } from "@/components/icons/PlatformIcons";
import { gsap, useGSAP } from "@/lib/motion/gsap";
import { duration, ease } from "@/lib/motion/tokens";
import { platforms } from "@/lib/site";

export function Hero() {
  const wrapRef = useRef<HTMLElement>(null);
  const progressRef = useRef(0);
  const [stats, setStats] = useState<RobotStats | null>(null);
  const reduce = useReducedMotion();
  const handleStats = useCallback((s: RobotStats) => setStats(s), []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const q = gsap.utils.selector(wrapRef);
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: wrapRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
            onUpdate: (self) => {
              progressRef.current = self.progress;
            },
          },
        });
        // Positions are expressed in scroll progress (0..1).
        tl.to(q("[data-hero='info']"), { opacity: 0, y: -12, duration: 0.12 }, 0.24)
          .to(q("[data-hero='wire']"), { opacity: 1, duration: 0.08 }, 0.56)
          .to(q("[data-hero='dims']"), { opacity: 1, duration: 0.1 }, 0.76)
          .to(q("[data-hero='copy']"), { opacity: 0, y: -48, duration: 0.14 }, 0.84)
          .to(q("[data-hero='viewer']"), { opacity: 0.25, scale: 0.96, duration: 0.12 }, 0.88)
          .to(q("[data-hero='cue']"), { opacity: 0, duration: 0.05 }, 0.02)
          .set({}, {}, 1);
        return () => {
          progressRef.current = 0;
        };
      });
      return () => mm.revert();
    },
    { scope: wrapRef },
  );

  return (
    <section ref={wrapRef} aria-labelledby="hero-title" className="relative lg:h-[220vh] motion-reduce:lg:h-auto">
      <div className="relative overflow-hidden lg:sticky lg:top-0 lg:h-svh lg:min-h-[640px] motion-reduce:lg:relative">
        <HeroBackground />

        <Container className="relative z-10 flex h-full flex-col pt-[calc(var(--nav-height)+40px)] lg:justify-center lg:pt-[var(--nav-height)]">
          <div data-hero="copy" className="max-w-[560px] lg:max-w-[520px] xl:max-w-[580px]">
            <motion.div
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: duration.normal, ease: ease.out, delay: 0.05 }}
            >
              <Badge tone="accent">
                <span className="size-1.5 rounded-full bg-accent-hover" aria-hidden />
                Professional CAD Software
              </Badge>
            </motion.div>

            <RevealText
              as="h1"
              id="hero-title"
              onMount
              delay={0.12}
              lines={["Design.", "Model.", <span key="e" className="text-accent-hover">Engineer.</span>]}
              className="mt-6 text-[3.25rem] leading-[0.98] font-semibold tracking-[-0.045em] text-fg xs:text-[3.6rem] sm:text-7xl lg:text-[5.25rem] xl:text-[6rem]"
            />

            <motion.div
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: duration.large, ease: ease.out, delay: 0.45 }}
            >
              <p className="mt-7 text-xl leading-snug font-medium tracking-[-0.015em] text-fg/90 sm:text-[22px]">
                Professional CAD software for modern engineering.
              </p>
              <p className="mt-4 max-w-[480px] text-[15.5px] leading-relaxed text-muted sm:text-base">
                Create precise 2D drawings, powerful 3D models, and professional engineering workflows in one
                desktop application.
              </p>

              <div className="mt-9 flex flex-col gap-3 xs:flex-row xs:flex-wrap">
                <DownloadPageButton platform="windows" />
                <LinkButton
                  href="#product"
                  variant="secondary"
                  size="lg"
                  trailingIcon={<ArrowRight aria-hidden className="size-4" />}
                >
                  Explore the platform
                </LinkButton>
              </div>

              <ul className="mt-6 flex items-center gap-4 text-[13px] text-muted" aria-label="Available platforms">
                {platforms.map((p, i) => (
                  <li key={p.id} className="flex items-center gap-4">
                    {i > 0 ? <span aria-hidden className="text-subtle">·</span> : null}
                    <span className="inline-flex items-center gap-1.5">
                      <PlatformIcon id={p.id} size={13} className="opacity-80" />
                      {p.name}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </Container>

        {/* 3D viewport */}
        <div
          data-hero="viewer"
          className="relative mt-6 h-[380px] w-full xs:h-[420px] sm:h-[520px] lg:absolute lg:inset-y-0 lg:right-0 lg:mt-0 lg:h-auto lg:w-[64%] xl:w-[62%]"
        >
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: duration.cinematic, ease: ease.out, delay: 0.3 }}
          >
            <RobotViewer variant="hero" progressRef={progressRef} onStats={handleStats} className="h-full w-full" />
          </motion.div>
          <HeroOverlay stats={stats} />

          <div
            data-hero="info"
            className="absolute bottom-6 right-4 hidden w-[220px] rounded-lg border border-line bg-surface-1/70 p-4 backdrop-blur-md sm:block lg:bottom-[16%] lg:right-[5%]"
          >
            <TechnicalLabel tone="accent" className="uppercase tracking-[0.16em]">
              3D Model
            </TechnicalLabel>
            <p className="mt-2 text-sm font-medium text-fg">Robot Arm · 6-axis</p>
            <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 font-mono text-[11px]">
              <dt className="text-subtle">Triangles</dt>
              <dd className="text-right tabular-nums text-fg/80">{stats ? stats.triangles.toLocaleString("en-US") : "—"}</dd>
              <dt className="text-subtle">Bounds</dt>
              <dd className="text-right tabular-nums text-fg/80">
                {stats ? `${Math.round(stats.size.x * 1000)} × ${Math.round(stats.size.y * 1000)} mm` : "—"}
              </dd>
              <dt className="text-subtle">Formats</dt>
              <dd className="text-right text-fg/80">STEP · IGES · STL</dd>
            </dl>
          </div>
        </div>

        <div
          data-hero="cue"
          aria-hidden
          className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 lg:flex"
        >
          <TechnicalLabel className="uppercase tracking-[0.2em]">Scroll to inspect</TechnicalLabel>
          <span className="h-8 w-px bg-gradient-to-b from-muted/60 to-transparent" />
        </div>
      </div>
    </section>
  );
}
