import type { Metadata } from "next";
import { LegalLayout } from "@/components/legal/LegalLayout";
import { privacy, terms } from "@/lib/content/legal";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: terms.title,
  description: terms.description,
  path: terms.path,
  image: "/opengraph-image",
});

export default function TermsPage() {
  return <LegalLayout document={terms} related={privacy} />;
}
