import type { Metadata } from "next";
import { site } from "./site";

type PageMetaInput = {
  title: string;
  description: string;
  /** Route path beginning with "/", used for the canonical URL. */
  path: string;
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
};

/** Consistent per-page metadata: title, description, canonical, OpenGraph, Twitter. */
export function pageMetadata({ title, description, path, image: imageInput, type = "website", publishedTime }: PageMetaInput): Metadata {
  // Setting openGraph replaces the inherited file-based image, so default to the
  // site card. Articles leave it unset to use their colocated opengraph-image.
  const image = imageInput ?? (type === "article" ? undefined : "/opengraph-image");
  const images = image ? [{ url: image, width: 1200, height: 630, alt: title }] : undefined;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName: site.name,
      type,
      ...(images ? { images } : {}),
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}

/** Serialises JSON-LD safely for a <script type="application/ld+json"> tag. */
export function jsonLd(data: Record<string, unknown>) {
  return { __html: JSON.stringify(data).replace(/</g, "\\u003c") };
}
