import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PublicLayout from "@/components/layout/PublicLayout";
import { getBlogPosts } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Blog",
  description: "Photography tips, behind-the-scenes stories, and insights from Myke Visuals.",
};

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <PublicLayout>
      <section style={{ background: "var(--color-bg)", padding: "120px 40px 150px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ marginBottom: "60px" }}>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--color-accent)", marginBottom: "16px" }}>INSIGHTS</p>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(40px, 8vw, 100px)", fontWeight: 400, letterSpacing: "-0.05em", lineHeight: 0.9, color: "var(--color-text-primary)" }}>Blog</h1>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "40px" }}>
            {posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ width: "100%", aspectRatio: "4/3", position: "relative", overflow: "hidden" }}>
                  <Image src={post.cover_image || "/assets/images/placeholder.jpg"} alt={post.title} fill style={{ objectFit: "cover", transition: "transform 0.6s ease" }} sizes="(max-width: 809px) 100vw, 33vw" />
                </div>
                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                  {post.tags?.slice(0, 1).map((tag) => (
                    <span key={tag} style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-accent)" }}>{tag}</span>
                  ))}
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--color-text-muted)" }}>
                    {post.published_at && new Date(post.published_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                </div>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(16px, 2vw, 22px)", fontWeight: 400, letterSpacing: "-0.02em", lineHeight: 1.3, color: "var(--color-text-primary)" }}>{post.title}</h2>
                {post.excerpt && <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", fontWeight: 300, color: "var(--color-text-muted)", lineHeight: 1.6 }}>{post.excerpt}</p>}
              </Link>
            ))}
          </div>

          {posts.length === 0 && (
            <p style={{ fontFamily: "var(--font-body)", fontSize: "16px", color: "var(--color-text-muted)", textAlign: "center", padding: "80px 0" }}>Posts coming soon.</p>
          )}
        </div>
      </section>
      <style>{`
        @media (max-width: 809px) { section > div > div:last-child { grid-template-columns: 1fr !important; } }
        @media (min-width: 810px) and (max-width: 1199px) { section > div > div:last-child { grid-template-columns: repeat(2, 1fr) !important; } }
      `}</style>
    </PublicLayout>
  );
}
