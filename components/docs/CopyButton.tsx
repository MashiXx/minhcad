"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/** Copies text to the clipboard and confirms with a short, announced state change. */
export function CopyButton({ value, label = "Copy code", className }: { value: string; label?: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={copy}
        aria-label={label}
        className={cn(
          "inline-flex h-8 min-w-8 items-center justify-center gap-1.5 rounded-md px-2 font-mono text-[11px] text-muted transition-colors duration-200 hover:bg-white/[0.06] hover:text-fg",
          className,
        )}
      >
        {copied ? <Check aria-hidden className="size-3.5 text-accent-hover" /> : <Copy aria-hidden className="size-3.5" />}
        <span aria-hidden className="hidden sm:inline">
          {copied ? "Copied" : "Copy"}
        </span>
      </button>
      <span role="status" className="sr-only">
        {copied ? "Copied to clipboard" : ""}
      </span>
    </>
  );
}
