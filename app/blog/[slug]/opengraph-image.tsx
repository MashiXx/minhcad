import { ImageResponse } from "next/og";
import { getPost, posts } from "@/lib/content/blog";
import { OgCanvas, OgCornerMarks, OgWordmark, ogColors, ogSize } from "@/lib/og/brand";
import { site } from "@/lib/site";
import { formatDate } from "@/lib/utils";

export const alt = `${site.name} Blog`;
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function BlogPostImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  const title = post?.title ?? `${site.name} Blog`;
  const fontSize = title.length > 48 ? 60 : 72;

  return new ImageResponse(
    (
      <OgCanvas glow="85% 15%">
        <OgCornerMarks />
        <div
          style={{
            position: "absolute",
            left: 80,
            right: 80,
            top: 76,
            bottom: 76,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <OgWordmark size={30} suffix="Blog" />

          <div style={{ display: "flex", flexDirection: "column" }}>
            {post ? (
              <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 18, letterSpacing: 3.5, color: ogColors.accentHover }}>
                <div style={{ display: "flex", width: 28, height: 1, backgroundColor: ogColors.accentHover }} />
                <span>{post.category.toUpperCase()}</span>
              </div>
            ) : null}
            <div
              style={{
                display: "flex",
                marginTop: 26,
                maxWidth: 940,
                fontSize,
                lineHeight: 1.06,
                letterSpacing: -2.5,
                color: ogColors.fg,
              }}
            >
              {title}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingTop: 26,
              borderTop: `1px solid ${ogColors.line}`,
              fontSize: 20,
              color: ogColors.muted,
            }}
          >
            <span>{post ? `${formatDate(post.date)} · ${post.readingTime} min read` : site.tagline}</span>
            <span style={{ color: ogColors.subtle }}>{new URL(site.url).host}/blog</span>
          </div>
        </div>
      </OgCanvas>
    ),
    { ...size },
  );
}
