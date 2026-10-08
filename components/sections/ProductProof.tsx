import { DraftingCompass, Gauge, MonitorSmartphone } from "lucide-react";
import { RevealGroup, RevealItem } from "@/components/motion/MotionReveal";
import { Container } from "@/components/ui/primitives";

const proofs = [
  {
    icon: DraftingCompass,
    title: "Professional CAD",
    body: "2D drafting, 3D solids and engineering drawings with industry-standard formats.",
  },
  {
    icon: Gauge,
    title: "High Performance",
    body: "GPU viewport and multi-core regeneration for large drawings and assemblies.",
  },
  {
    icon: MonitorSmartphone,
    title: "Cross Platform",
    body: "Native builds for Windows, macOS and Ubuntu. One license, every desktop.",
  },
];

export function ProductProof() {
  return (
    <section id="product" aria-label="Why KufCad" className="relative scroll-mt-[var(--nav-height)] border-y border-line bg-surface-1/40">
      <Container>
        <RevealGroup as="ul" stagger={0.1} className="grid divide-line sm:grid-cols-3 sm:divide-x">
          {proofs.map(({ icon: Icon, title, body }) => (
            <RevealItem as="li" key={title} className="flex gap-4 py-8 sm:px-6 sm:py-10 first:sm:pl-0 last:sm:pr-0 lg:px-10">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-line-strong bg-white/[0.02] text-accent-hover">
                <Icon aria-hidden className="size-[18px]" strokeWidth={1.6} />
              </span>
              <div>
                <h2 className="text-[15px] font-semibold tracking-[-0.01em] text-fg">{title}</h2>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{body}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
