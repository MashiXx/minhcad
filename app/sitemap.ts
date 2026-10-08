import type { MetadataRoute } from "next";
import { posts } from "@/lib/content/blog";
import { docs } from "@/lib/content/docs";
import { privacy, terms } from "@/lib/content/legal";
import { release, site } from "@/lib/site";

type Entry = MetadataRoute.Sitemap[number];

const latest = (dates: string[]) => dates.reduce((a, b) => (a > b ? a : b), release.date);

/**
 * All public routes. Dates come from content, never from the clock, so the
 * sitemap is fully static.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => `${site.url}${path === "/" ? "" : path}`;
  const blogUpdated = latest(posts.map((post) => post.date));
  const docsUpdated = latest(docs.map((doc) => doc.updated));

  const pages: Entry[] = [
    { url: url("/"), lastModified: latest([blogUpdated]), changeFrequency: "weekly", priority: 1 },
    { url: url("/features"), lastModified: release.date, changeFrequency: "monthly", priority: 0.9 },
    { url: url("/download"), lastModified: release.date, changeFrequency: "monthly", priority: 0.9 },
    { url: url("/pricing"), lastModified: release.date, changeFrequency: "monthly", priority: 0.8 },
    { url: url("/docs"), lastModified: docsUpdated, changeFrequency: "weekly", priority: 0.8 },
    { url: url("/support"), lastModified: release.date, changeFrequency: "monthly", priority: 0.6 },
    { url: url("/about"), lastModified: release.date, changeFrequency: "yearly", priority: 0.5 },
    { url: url("/blog"), lastModified: blogUpdated, changeFrequency: "weekly", priority: 0.7 },
    { url: url(privacy.path), lastModified: privacy.updated, changeFrequency: "yearly", priority: 0.2 },
    { url: url(terms.path), lastModified: terms.updated, changeFrequency: "yearly", priority: 0.2 },
  ];

  const docPages: Entry[] = docs.map((doc) => ({
    url: url(`/docs/${doc.slug}`),
    lastModified: doc.updated,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const blogPages: Entry[] = posts.map((post) => ({
    url: url(`/blog/${post.slug}`),
    lastModified: post.date,
    changeFrequency: "yearly",
    priority: 0.5,
  }));

  return [...pages, ...docPages, ...blogPages];
}
