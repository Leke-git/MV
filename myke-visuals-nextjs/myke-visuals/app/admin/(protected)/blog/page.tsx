export const dynamic = "force-dynamic";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Blog Posts — Admin" };

export default async function AdminBlogPage() {
  const supabase = await createServerSupabaseClient();
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false });

  const list = posts || [];

  return (
    <div>
      <div style={{ marginBottom: "40px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ fontFamily: '"Clash Display", sans-serif', fontSize: "32px", fontWeight: 400, letterSpacing: "-0.03em", color: "#faf5ea" }}>Blog Posts</h1>
        <Link href="/admin/blog/new" style={{ fontFamily: '"Clash Display", sans-serif', fontSize: "13px", fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase", color: "#0a0a0a", background: "#faf5ea", padding: "12px 24px", textDecoration: "none" }}>
          + New Post
        </Link>
      </div>

      {list.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 40px", background: "#1a1a1a", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.07)" }}>
          <p style={{ fontFamily: '"Clash Display", sans-serif', fontSize: "20px", color: "#faf5ea", marginBottom: "12px" }}>No blog posts yet</p>
          <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "14px", color: "#bababa", marginBottom: "24px" }}>Create your first post to get started.</p>
          <Link href="/admin/blog/new" style={{ fontFamily: '"Clash Display", sans-serif', fontSize: "13px", fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase", color: "#0a0a0a", background: "#ff7738", padding: "12px 24px", textDecoration: "none" }}>
            Create First Post
          </Link>
        </div>
      ) : (
        <div style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "8px", overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "3fr 1fr 1fr 1fr", padding: "14px 24px", borderBottom: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.03)" }}>
            {["Title", "Status", "Date", "Actions"].map((h) => (
              <span key={h} style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", color: "#bababa" }}>{h}</span>
            ))}
          </div>

          {list.map((post) => (
            <div key={post.id} style={{ display: "grid", gridTemplateColumns: "3fr 1fr 1fr 1fr", padding: "16px 24px", borderBottom: "1px solid rgba(255,255,255,0.04)", alignItems: "center" }}>
              <div>
                <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "14px", color: "#faf5ea", fontWeight: 500 }}>{post.title}</p>
                {post.tags?.length > 0 && (
                  <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "12px", color: "#bababa", marginTop: "2px" }}>
                    {post.tags.join(", ")}
                  </p>
                )}
              </div>
              <span style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "11px", letterSpacing: "0.05em", textTransform: "uppercase", color: post.published ? "#4ade80" : "#bababa", background: post.published ? "rgba(74,222,128,0.1)" : "rgba(255,255,255,0.05)", padding: "3px 8px", borderRadius: "3px", width: "fit-content" }}>
                {post.published ? "Published" : "Draft"}
              </span>
              <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "12px", color: "#bababa" }}>
                {new Date(post.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
              </p>
              <div style={{ display: "flex", gap: "12px" }}>
                <Link href={`/admin/blog/${post.id}/edit`} style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "13px", color: "#ff7738", textDecoration: "none" }}>Edit</Link>
                <Link href={`/blog/${post.slug}`} target="_blank" style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "13px", color: "#bababa", textDecoration: "none" }}>View</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
