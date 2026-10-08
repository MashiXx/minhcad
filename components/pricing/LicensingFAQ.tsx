import { ChevronDown } from "lucide-react";

export type FaqItem = { question: string; answer: string };

/** Native <details>/<summary> disclosures: keyboard and screen-reader support built in. */
export function LicensingFAQ({ items }: { items: FaqItem[] }) {
  return (
    <ul className="divide-y divide-line border-y border-line">
      {items.map((item) => (
        <li key={item.question}>
          <details className="group">
            <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-6 py-4 text-left text-[15px] font-medium text-fg transition-colors hover:text-accent-hover sm:text-base [&::-webkit-details-marker]:hidden">
              {item.question}
              <span
                aria-hidden
                className="flex size-8 shrink-0 items-center justify-center rounded-md border border-line text-muted transition-[transform,color,border-color] duration-200 ease-[var(--ease-out-expo)] group-open:rotate-180 group-open:border-line-strong group-open:text-fg"
              >
                <ChevronDown className="size-4" />
              </span>
            </summary>
            <p className="text-pretty max-w-3xl pb-6 pr-12 text-[15px] leading-relaxed text-muted">{item.answer}</p>
          </details>
        </li>
      ))}
    </ul>
  );
}
