import {
  Aperture,
  Boxes,
  Box,
  CircleQuestionMark,
  Download,
  Files,
  PencilRuler,
  Rocket,
  SquareTerminal,
  Wrench,
  type LucideProps,
} from "lucide-react";
import type { DocIcon as DocIconName } from "@/lib/content/docs";

const icons = {
  rocket: Rocket,
  download: Download,
  drafting: PencilRuler,
  modeling: Box,
  assemblies: Boxes,
  rendering: Aperture,
  formats: Files,
  automation: SquareTerminal,
  troubleshooting: Wrench,
  faq: CircleQuestionMark,
} as const;

/** Category icon for documentation navigation and cards. */
export function DocIcon({ name, ...props }: LucideProps & { name: DocIconName }) {
  const Icon = icons[name];
  return <Icon aria-hidden strokeWidth={1.7} {...props} />;
}
