"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Keeps legacy single-page links such as /docs#installation working by
 * forwarding them to the matching page (/docs/installation) or section.
 */
export function DocsHashRedirect({ targets }: { targets: Record<string, string> }) {
  const router = useRouter();

  useEffect(() => {
    const hash = decodeURIComponent(window.location.hash.slice(1));
    if (!hash || document.getElementById(hash)) return;
    const target = targets[hash];
    if (target) router.replace(target);
  }, [router, targets]);

  return null;
}
