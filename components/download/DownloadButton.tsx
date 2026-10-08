"use client";

import { useEffect, useState } from "react";
import { ArrowDownToLine, ArrowRight, LoaderCircle } from "lucide-react";
import { PlatformIcon } from "@/components/icons/PlatformIcons";
import { buttonClass, LinkButton } from "@/components/ui/Button";
import { getPlatform, type DownloadFile, type PlatformId } from "@/lib/site";

type Common = {
  platform: PlatformId;
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  className?: string;
  label?: string;
};

/** Navigates to the download page with the platform preselected. */
export function DownloadPageButton({ platform, variant = "primary", size = "lg", className, label }: Common) {
  const p = getPlatform(platform);
  return (
    <LinkButton
      href={`/download?platform=${platform}`}
      variant={variant}
      size={size}
      className={className}
      icon={<PlatformIcon id={platform} size={16} />}
      trailingIcon={<ArrowRight aria-hidden className="size-4" />}
    >
      {label ?? `Download for ${p.name}`}
    </LinkButton>
  );
}

/**
 * Direct file download. Shows a brief "Starting download" state after click;
 * it never simulates progress, because the browser owns the transfer.
 */
export function DownloadFileButton({
  platform,
  file,
  variant = "primary",
  size = "lg",
  className,
  label,
}: Common & { file?: DownloadFile }) {
  const p = getPlatform(platform);
  const target = file ?? p.files[0];
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    if (!starting) return;
    const id = window.setTimeout(() => setStarting(false), 2200);
    return () => window.clearTimeout(id);
  }, [starting]);

  return (
    <a
      href={target.url}
      download={target.fileName}
      onClick={() => setStarting(true)}
      aria-live="polite"
      className={buttonClass(variant, size, className)}
    >
      <span className="-ml-0.5 flex shrink-0 items-center">
        <PlatformIcon id={platform} size={16} />
      </span>
      <span>{starting ? "Starting download…" : label ?? `Download for ${p.name}`}</span>
      <span className="-mr-1 flex shrink-0 items-center transition-transform duration-200 ease-[var(--ease-out-expo)] group-hover/btn:translate-y-[3px]">
        {starting ? (
          <LoaderCircle aria-hidden className="size-4 animate-spin" />
        ) : (
          <ArrowDownToLine aria-hidden className="size-4" />
        )}
      </span>
    </a>
  );
}
