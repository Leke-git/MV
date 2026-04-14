"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import type { BlogPost } from "@/types";

interface Props { posts: BlogPost[]; }

const fallbackPosts: Partial<BlogPost>[] = [
  { id: "1", title: "Why Your Brand Needs a Professional Photography Session in 2025", slug: "why-your-brand-needs-a-professional-photography-session-in-2025", tags: ["ARTICLE"], published_at: "2024-03-06", cover_image: "/assets/images/blog-1.jpg" },
  { id: "2", title: "What to Wear to Your Portrait Session — and Why It Matters", slug: "what-to-wear-to-your-portrait-session-and-why-it-matters", tags: ["TIPS"], published_at: "2024-04-19", cover_image: "/assets/images/blog-2.jpg" },
  { id: "3", title: "Inside Myke Visuals Studio — Abuja's Creative Space for Hire", slug: "inside-myke-visuals-studio-abujas-creative-space-for-hire", tags: ["TIPS"], published_at: "2024-05-03", cover_image: "/assets/images/blog-3.jpg" },
];

// Corner brackets reused from albums
function CornerBrackets({ visible }: { visible: boolean }) {
  const s: React.CSSProperties = {
    position: "absolute", width: "18px", height: "18px",
    opacity: visible ? 1 : 0, transition: "opacity 0.25s ease", zIndex: 5,
  };
  const line: React.CSSProperties = { position: "absolute", background: "var(--color-text-primary)" };
  return (
    <>
      <div style={{ ...s, top: "12px", left: "12px" }}>
        <div style={{ ...line, top: 0, left: 0, width: "2px", height: "100%" }} />
        <div style={{ ...line, top: 0, left: 0, width: "100%", height: "2px" }} />
      </div>
      <div style={{ ...s, top: "12px", right: "12px" }}>
        <div style={{ ...line, top: 0, right: 0, width: "2px", height: "100%" }} />
        <div style={{ ...line, top: 0, right: 0, width: "100%", height: "2px" }} />
      </div>
      <div style={{ ...s, bottom: "12px", left: "12px" }}>
        <div style={{ ...line, bottom: 0, left: 0, width: "2px", height: "100%" }} />
        <div style={{ ...line, bottom: 0, left: 0, width: "100%", height: "2px" }} />
      </div>
      <div style={{ ...s, bottom: "12px", right: "12px" }}>
        <div style={{ ...line, bottom: 0, right: 0, width: "2px", height: "100%" }} />
        <div style={{ ...line, bottom: 0, right: 0, width: "100%", height: "2px" }} />
      </div>
    </>
  );
}

function CustomCursor({ x, y, visible }: { x: number; y: number; visible: boolean }) {
  return (
    <div style={{
      position: "fixed", left: x, top: y,
      width: "68px", height: "68px", borderRadius: "50%",
      background: "var(--color-text-primary)", color: "var(--color-bg)",
      display: "flex", alignItems: "center", justifyContent: "center",
      pointerEvents: "none", zIndex: 9999,
      transform: "translate(-50%, -50%)",
      opacity: visible ? 1 : 0, transition: "opacity 0.2s ease",
      fontFamily: "var(--font-display)", fontSize: "11px",
      fontWeight: 600, letterSpacing: "0.1em",
    }}>
      READ
    </div>
  );
}

function BlogCard({ post }: { post: Partial<BlogPost> }) {
  const [hovered, setHovered] = useState(false);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setCursor({ x: e.clientX, y: e.clientY });
  }, []);

  return (
    <>
      <CustomCursor x={cursor.x} y={cursor.y} visible={hovered} />
      <Link
        href={`/blog/${post.slug}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onMouseMove={handleMouseMove}
        style={{ display: "flex", flexDirection: "column", gap: "12px", cursor: "none" }}
      >
        {/* Thumbnail */}
        <div style={{
          width: "100%", aspectRatio: "4/3",
          position: "relative", overflow: "hidden",
        }}>
          <Image
            src={post.cover_image || "/assets/images/placeholder.jpg"}
            alt={post.title || ""} fill
            style={{ objectFit: "cover", transition: "transform 0.6s ease",
              transform: hovered ? "scale(1.04)" : "scale(1)" }}
            sizes="(max-width: 809px) 100vw, 33vw"
          />
          <CornerBrackets visible={hovered} />
        </div>

        {/* Meta */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {post.tags?.slice(0, 1).map(tag => (
              <span key={tag} style={{
                fontFamily: "var(--font-mono)", fontSize: "11px",
                letterSpacing: "0.1em", textTransform: "uppercase",
                color: "var(--color-accent)",
              }}>{tag}</span>
            ))}
            {post.published_at && (
              <span style={{
                fontFamily: "var(--font-mono)", fontSize: "11px",
                color: "var(--color-text-muted)",
              }}>
                {new Date(post.published_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
              </span>
            )}
          </div>
          <h3 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(16px, 2vw, 20px)",
            fontWeight: 400, letterSpacing: "-0.02em", lineHeight: 1.3,
            color: "var(--color-text-primary)",
          }}>
            {post.title}
          </h3>
        </div>
      </Link>
    </>
  );
}

export default function BlogSection({ posts }: Props) {
  const displayPosts = posts.length > 0 ? posts : fallbackPosts;

  return (
    <section style={{ background: "var(--color-bg)", padding: "0 40px 150px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "flex-end", marginBottom: "40px",
          paddingBottom: "16px", borderBottom: "1px solid var(--color-border-subtle)",
        }}>
          <div>
            <p style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(15px, 1.8vw, 20px)",
              fontWeight: 300, letterSpacing: "-0.01em",
              color: "var(--color-text-muted)",
              lineHeight: 1.2, marginBottom: "6px",
            }}>
              Stay inspired with my
            </p>
            <h2 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(36px, 6vw, 72px)",
              fontWeight: 400, letterSpacing: "-0.045em", lineHeight: 0.9,
              color: "var(--color-accent)",
            }}>
              Insightful Articles
            </h2>
          </div>
          <Link href="/blog" style={{
            fontFamily: "var(--font-display)", fontSize: "13px",
            fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase",
            color: "var(--color-text-muted)",
            borderBottom: "1px solid var(--color-border-subtle)", paddingBottom: "2px",
            whiteSpace: "nowrap",
          }}>
            All Blogs →
          </Link>
        </div>

        {/* Posts grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
          {displayPosts.map(post => <BlogCard key={post.id} post={post} />)}
        </div>
      </div>

      <style>{`
        @media (max-width: 809px) {
          section > div > div:last-child { grid-template-columns: 1fr !important; }
        }
        @media (min-width: 810px) and (max-width: 1100px) {
          section > div > div:last-child { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </section>
  );
}
