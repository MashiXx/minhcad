import type { Metadata } from "next";
import { Hero } from "@/components/hero/Hero";
import { ProductProof } from "@/components/sections/ProductProof";
import {
  CapabilitiesSection,
  Cad2DSection,
  CrossPlatformSection,
  DownloadCTASection,
  ModelingSection,
  PerformanceSection,
  PricingCTASection,
} from "@/components/sections/HomeSections";
import { jsonLd, pageMetadata } from "@/lib/seo";
import { plans, release, site } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: `${site.name} — Professional CAD Software for Windows, macOS and Ubuntu`,
  description: site.description,
  path: "/",
});

const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: site.name,
  applicationCategory: "DesignApplication",
  operatingSystem: "Windows 10, Windows 11, macOS 13+, Ubuntu 22.04, Ubuntu 24.04",
  softwareVersion: release.version,
  datePublished: release.date,
  description: site.description,
  url: site.url,
  offers: plans.map((p) => ({
    "@type": "Offer",
    name: p.name,
    price: p.price === "Free" ? "0" : p.price.replace("$", ""),
    priceCurrency: "USD",
  })),
};

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(structuredData)} />
      <Hero />
      <ProductProof />
      <Cad2DSection />
      <ModelingSection />
      <CapabilitiesSection />
      <PerformanceSection />
      <CrossPlatformSection />
      <PricingCTASection />
      <DownloadCTASection />
    </>
  );
}
