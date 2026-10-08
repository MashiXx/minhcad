import type { Metadata } from "next";
import { LegalLayout } from "@/components/legal/LegalLayout";
import { privacy, terms } from "@/lib/content/legal";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: privacy.title,
  description: privacy.description,
  path: privacy.path,
  image: "/opengraph-image",
});

export default function PrivacyPage() {
  return <LegalLayout document={privacy} related={terms} />;
}
