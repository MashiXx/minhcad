import Image from "next/image";
import { ScreenshotFrame } from "@/components/cad/ScreenshotFrame";
import { CornerMarks, TechnicalLabel } from "@/components/ui/primitives";
import { screenshots, type ImageAsset } from "@/lib/content/assets";
import type { Feature } from "@/lib/content/features";

const sizes = "(min-width: 1280px) 520px, (min-width: 768px) 50vw, 100vw";

/** Real application captures, used where a feature maps onto a KufCad workspace. */
const workspaceCaptures: Partial<Record<string, { asset: ImageAsset; title: string; meta: string; status: string[] }>> = {
  "2d-drafting": {
    asset: screenshots.cad2d,
    title: "interchange-plan.dwg — KufCad",
    meta: "Drawing · 1:1000",
    status: ["Model space", "Snap · Ortho · Polar"],
  },
  "3d-modeling": {
    asset: screenshots.cad3d,
    title: "six-axis-arm.step — KufCad",
    meta: "Gouraud shaded · 2 viewports",
    status: ["Modelling workspace", "Units: mm"],
  },
};

/** Product visual for a feature: a real workspace capture or a framed figure. */
export function FeatureVisual({ feature }: { feature: Feature }) {
  const capture = workspaceCaptures[feature.id];

  if (capture) {
    return (
      <ScreenshotFrame
        title={capture.title}
        meta={capture.meta}
        status={capture.status.map((s) => (
          <span key={s}>{s}</span>
        ))}
      >
        <Image
          src={capture.asset.src}
          alt={capture.asset.alt}
          width={capture.asset.width}
          height={capture.asset.height}
          sizes={sizes}
          className="h-auto w-full"
        />
      </ScreenshotFrame>
    );
  }

  const [primary] = feature.meta;
  return (
    <figure className="relative overflow-hidden rounded-[16px] border border-line-strong bg-surface-1 shadow-[0_40px_100px_-48px_rgb(0_0_0/0.95)]">
      <div className="flex h-9 items-center justify-between gap-4 border-b border-line bg-surface-2/90 px-3.5">
        <TechnicalLabel className="uppercase tracking-[0.14em]">
          Fig. {feature.index} — {feature.title}
        </TechnicalLabel>
        {primary ? (
          <TechnicalLabel tone="accent" className="hidden truncate sm:block">
            {primary.value}
          </TechnicalLabel>
        ) : null}
      </div>
      <div className="cad-grid-fine relative bg-[#0b0e12]">
        <Image
          src={feature.image.src}
          alt={feature.image.alt}
          width={feature.image.width}
          height={feature.image.height}
          sizes={sizes}
          className="h-auto w-full"
        />
        <CornerMarks className="m-3" />
      </div>
    </figure>
  );
}
