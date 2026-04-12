import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import PublicLayout from "@/components/layout/PublicLayout";
import { getBlogPostBySlug, getBlogPosts } from "@/lib/queries";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) return [];
  const { createAdminClient } = await import("@/lib/supabase/server");
  const supabase = createAdminClient();
  const { data } = await supabase.from("blog_posts").select("slug").eq("published", true);
  return (data || []).map((p: { slug: string }) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return { title: "Post Not Found" };
  return {
    title: post.meta_title || post.title,
    description: post.meta_description || post.excerpt,
    openGraph: {
      images: post.cover_image ? [{ url: post.cover_image }] : [],
      type: "article",
      publishedTime: post.published_at,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  return (
    <PublicLayout heroPadding>
      {/* Hero */}
      {post.cover_image && (
        <section style={{ position: "relative", height: "60vh", minHeight: "400px", overflow: "hidden" }}>
          <Image src={post.cover_image} alt={post.title} fill priority style={{ objectFit: "cover" }} sizes="100vw" />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.7))", zIndex: 1 }} />
        </section>
      )}

      {/* Content */}
      <article style={{ background: "var(--color-bg)", padding: "80px 40px 150px" }}>
        <div style={{ maxWidth: "760px", margin: "0 auto" }}>
          {/* Meta */}
          <div style={{ display: "flex", gap: "16px", alignItems: "center", marginBottom: "32px", flexWrap: "wrap" }}>
            {post.tags?.map((tag) => (
              <span key={tag} style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-accent)" }}>{tag}</span>
            ))}
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--color-text-muted)" }}>
              {post.published_at && new Date(post.published_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
            </span>
          </div>

          {/* Title */}
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 5vw, 52px)", fontWeight: 400, letterSpacing: "-0.03em", lineHeight: 1.1, color: "var(--color-text-primary)", marginBottom: "48px" }}>
            {post.title}
          </h1>

          {/* Body */}
          <div
            style={{ fontFamily: "var(--font-body)", fontSize: "17px", fontWeight: 300, color: "var(--color-text-muted)", lineHeight: 1.8 }}
            dangerouslySetInnerHTML={{ __html: post.body?.replace(/\n/g, "<br>") || "" }}
          />

          {/* Back link */}
          <div style={{ marginTop: "80px", paddingTop: "40px", borderTop: "1px solid var(--color-border-subtle)" }}>
            <Link href="/blog" style={{ fontFamily: "var(--font-display)", fontSize: "13px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-text-muted)", display: "inline-flex", alignItems: "center", gap: "8px" }}>
              ← All Articles
            </Link>
          </div>
        </div>
      </article>
    </PublicLayout>
  );
}
