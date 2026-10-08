import Image from "next/image";
import { MotionReveal } from "@/components/motion/MotionReveal";
import { CornerMarks, TechnicalLabel } from "@/components/ui/primitives";
import { images } from "@/lib/content/assets";
import { cn } from "@/lib/utils";

/**
 * Download page visual: the yellow robot arm on a measured baseline, with a
 * small 2D flange drawing card, echoing the 3D and 2D workspaces.
 */
export function DownloadVisual({ className }: { className?: string }) {
  const robot = images.robotTall;
  const flange = images.flangeDrawing;

  return (
    <div className={cn("relative mx-auto w-full max-w-[460px]", className)}>
      <MotionReveal preset="scaleIn" amount={0.15} className="relative ml-auto w-[78%]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-[-12%] bottom-[2%] h-[38%] rounded-[50%] border border-white/[0.06] [transform:perspective(600px)_rotateX(72deg)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-[8%] h-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(47_123_255/0.14),transparent)]"
        />
        <Image
          src={robot.src}
          alt={robot.alt}
          width={robot.width}
          height={robot.height}
          sizes="(min-width: 1024px) 360px, 70vw"
          priority
          className="relative h-auto w-full [mask-image:radial-gradient(ellipse_62%_58%_at_50%_48%,#000_62%,transparent_100%)]"
        />
        {/* Overall height dimension */}
        <div aria-hidden className="absolute inset-y-[8%] -right-3 hidden w-px bg-white/15 sm:block">
          <span className="absolute -left-1 top-0 h-px w-2.5 bg-white/30" />
          <span className="absolute -left-1 bottom-0 h-px w-2.5 bg-white/30" />
          <TechnicalLabel className="absolute left-2 top-1/2 -translate-y-1/2 whitespace-nowrap text-subtle [writing-mode:vertical-rl]">
            H 1210.00
          </TechnicalLabel>
        </div>
      </MotionReveal>

      <MotionReveal
        preset="fadeUp"
        delay={0.15}
        amount={0.1}
        className="absolute bottom-[4%] left-0 w-[50%] max-w-[230px]"
      >
        <figure className="relative overflow-hidden rounded-[12px] border border-line-strong bg-surface-1/95 shadow-[0_24px_60px_-28px_rgb(0_0_0/0.95)]">
          <figcaption className="flex h-8 items-center justify-between gap-2 border-b border-line px-3">
            <TechnicalLabel className="truncate">flange-r25.dwg</TechnicalLabel>
            <TechnicalLabel tone="accent">2D</TechnicalLabel>
          </figcaption>
          <div className="relative">
            <Image
              src={flange.src}
              alt={flange.alt}
              width={flange.width}
              height={flange.height}
              sizes="230px"
              className="h-auto w-full"
            />
            <CornerMarks className="m-2" />
          </div>
        </figure>
      </MotionReveal>
    </div>
  );
}
