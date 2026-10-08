import Image from "next/image";
import { CornerMarks, TechnicalLabel } from "@/components/ui/primitives";
import type { ImageAsset } from "@/lib/content/assets";
import { cn } from "@/lib/utils";

type FigureStageProps = {
  image: ImageAsset;
  /** Monospaced annotation in the top-left corner, e.g. "Fig. 01". */
  label?: string;
  /** Optional annotation in the bottom-right corner. */
  meta?: string;
  /** Maximum rendered height of the image in CSS pixels. */
  maxHeight?: number;
  preload?: boolean;
  className?: string;
};

/**
 * Presents a visual on a technical "drawing board": a subtle grid with corner
 * marks. Images are never upscaled beyond their intrinsic size or cropped.
 */
export function FigureStage({ image, label, meta, maxHeight = 380, preload = false, className }: FigureStageProps) {
  const displayWidth = Math.min(image.width, Math.round((maxHeight * image.width) / image.height));
  return (
    <div className={cn("relative overflow-hidden rounded-[14px] border border-line bg-surface-1/70", className)}>
      <div aria-hidden className="cad-grid-fine pointer-events-none absolute inset-0" />
      <div aria-hidden className="cad-grid pointer-events-none absolute inset-0 opacity-80" />
      <CornerMarks className="m-3" />
      {label ? (
        <TechnicalLabel className="absolute left-5 top-5 uppercase text-subtle">{label}</TechnicalLabel>
      ) : null}
      {meta ? (
        <TechnicalLabel className="absolute bottom-5 right-5 uppercase text-subtle">{meta}</TechnicalLabel>
      ) : null}
      <div className="relative flex items-center justify-center px-5 py-11 sm:px-10 sm:py-12">
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          preload={preload}
          sizes={`(min-width: 768px) ${displayWidth}px, 88vw`}
          style={{ width: displayWidth }}
          className="h-auto max-w-full rounded-[8px] border border-line shadow-[0_24px_60px_-30px_rgb(0_0_0/0.9)]"
        />
      </div>
    </div>
  );
}
