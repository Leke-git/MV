"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import type { BlogPost } from "@/types";

interface Props { post?: BlogPost; }

function slugify(t: string) {
  return t.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();
}

async function uploadImage(file: File, supabase: ReturnType<typeof createClient>): Promise<string> {
  const ext = file.name.split(".").pop();
  const path = `blog/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage.from("images").upload(path, file, { cacheControl: "3600" });
  if (error) throw new Error(error.message);
  return supabase.storage.from("images").getPublicUrl(path).data.publicUrl;
}

const inp: React.CSSProperties = { width: "100%", background: "#111", border: "1px solid rgba(255,255,255,0.08)", color: "#faf5ea", fontFamily: '"Satoshi", sans-serif', fontSize: "14px", padding: "11px 13px", outline: "none", borderRadius: "4px" };
const lbl: React.CSSProperties = { fontFamily: '"Satoshi", sans-serif', fontSize: "11px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "#bababa", display: "block", marginBottom: "6px" };
const section: React.CSSProperties = { background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "8px", padding: "28px", marginBottom: "24px" };

export default function BlogEditor({ post }: Props) {
  const router = useRouter();
  const supabase = createClient();
  const isEditing = !!post;
  const coverInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    title: post?.title || "",
    slug: post?.slug || "",
    excerpt: post?.excerpt || "",
    body: post?.body || "",
    cover_image: post?.cover_image || "",
    tags: post?.tags?.join(", ") || "",
    featured: post?.featured || false,
    published: post?.published || false,
    meta_title: post?.meta_title || "",
    meta_description: post?.meta_description || "",
  });

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [coverUploading, setCoverUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<"write" | "preview" | "seo">("write");
  const [tagInput, setTagInput] = useState(post?.tags?.join(", ") || "");

  function handleTitleChange(value: string) {
    setForm(f => ({ ...f, title: value, slug: isEditing ? f.slug : slugify(value) }));
  }

  async function handleCoverUpload(file: File) {
    setCoverUploading(true);
    try {
      const url = await uploadImage(file, supabase);
      setForm(f => ({ ...f, cover_image: url }));
    } catch (e: any) {
      setError("Cover image upload failed: " + e.message);
    }
    setCoverUploading(false);
  }

  const handleCoverDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith("image/")) handleCoverUpload(file);
  }, []);

  async function handleSave() {
    if (!form.title.trim()) { setError("Title is required."); return; }
    if (!form.slug.trim()) { setError("Slug is required."); return; }
    setSaving(true); setError("");

    const tags = tagInput.split(",").map(t => t.trim()).filter(Boolean);
    const payload = {
      title: form.title.trim(),
      slug: form.slug.trim(),
      excerpt: form.excerpt.trim(),
      body: form.body,
      cover_image: form.cover_image,
      tags,
      featured: form.featured,
      published: form.published,
      published_at: form.published ? new Date().toISOString() : null,
      meta_title: form.meta_title.trim() || null,
      meta_description: form.meta_description.trim() || null,
    };

    const result = isEditing
      ? await supabase.from("blog_posts").update(payload).eq("id", post.id)
      : await supabase.from("blog_posts").insert(payload);

    if (result.error) { setError(result.error.message); setSaving(false); return; }
    router.push("/admin/blog");
    router.refresh();
  }

  async function handleDelete() {
    if (!post) return;
    if (!confirm(`Delete "${post.title}"? Cannot be undone.`)) return;
    setDeleting(true);
    await supabase.from("blog_posts").delete().eq("id", post.id);
    router.push("/admin/blog");
    router.refresh();
  }

  // Simple markdown preview renderer
  function renderMarkdown(md: string) {
    return md
      .replace(/^### (.+)/gm, '<h3 style="font-family: Clash Display; font-size: 20px; color: #faf5ea; margin: 24px 0 12px; font-weight: 400; letter-spacing: -0.02em;">$1</h3>')
      .replace(/^## (.+)/gm, '<h2 style="font-family: Clash Display; font-size: 26px; color: #faf5ea; margin: 32px 0 16px; font-weight: 400; letter-spacing: -0.03em;">$1</h2>')
      .replace(/^# (.+)/gm, '<h1 style="font-family: Clash Display; font-size: 36px; color: #faf5ea; margin: 40px 0 20px; font-weight: 400; letter-spacing: -0.04em;">$1</h1>')
      .replace(/\*\*(.+?)\*\*/g, '<strong style="color: #faf5ea; font-weight: 600;">$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`(.+?)`/g, '<code style="background: rgba(255,255,255,0.08); padding: 2px 6px; border-radius: 3px; font-size: 13px; color: #ff7738;">$1</code>')
      .replace(/^\- (.+)/gm, '<li style="margin-bottom: 6px; color: #bababa;">$1</li>')
      .replace(/^(\d+)\. (.+)/gm, '<li style="margin-bottom: 6px; color: #bababa;">$2</li>')
      .replace(/\n\n/g, '</p><p style="margin: 0 0 20px; color: #bababa; line-height: 1.8; font-weight: 300;">')
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" style="color: #ff7738; text-decoration: underline;">$1</a>');
  }

  const tabStyle = (t: string): React.CSSProperties => ({
    fontFamily: '"Satoshi", sans-serif', fontSize: "13px", padding: "8px 20px",
    background: activeTab === t ? "rgba(255,255,255,0.08)" : "transparent",
    border: "none", color: activeTab === t ? "#faf5ea" : "#555",
    cursor: "pointer", borderRadius: "6px", fontWeight: activeTab === t ? 500 : 400,
  });

  return (
    <div style={{ maxWidth: "860px" }}>
      {/* Header */}
      <div style={{ marginBottom: "32px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <button onClick={() => router.push("/admin/blog")} style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "13px", color: "#555", background: "none", border: "none", cursor: "pointer", padding: 0, marginBottom: "12px", display: "block" }}>← Back to Blog</button>
          <h1 style={{ fontFamily: '"Clash Display", sans-serif', fontSize: "32px", fontWeight: 400, letterSpacing: "-0.03em", color: "#faf5ea" }}>{isEditing ? "Edit Post" : "New Post"}</h1>
        </div>
        <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
          {isEditing && (
            <button onClick={handleDelete} disabled={deleting} style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "13px", color: "#ef4444", background: "none", border: "1px solid rgba(239,68,68,0.3)", padding: "10px 20px", cursor: "pointer", borderRadius: "4px" }}>
              {deleting ? "Deleting…" : "Delete"}
            </button>
          )}
          {/* Featured toggle */}
          <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
            <div onClick={() => setForm(f => ({ ...f, featured: !f.featured }))}
              style={{ width: "36px", height: "20px", borderRadius: "10px", background: form.featured ? "#ff7738" : "rgba(255,255,255,0.1)", position: "relative", cursor: "pointer", transition: "background 0.2s" }}>
              <div style={{ position: "absolute", top: "2px", left: form.featured ? "18px" : "2px", width: "16px", height: "16px", borderRadius: "50%", background: "#faf5ea", transition: "left 0.2s" }} />
            </div>
            <span style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "13px", color: "#bababa" }}>Featured</span>
          </label>
          {/* Published toggle */}
          <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
            <div onClick={() => setForm(f => ({ ...f, published: !f.published }))}
              style={{ width: "36px", height: "20px", borderRadius: "10px", background: form.published ? "#4ade80" : "rgba(255,255,255,0.1)", position: "relative", cursor: "pointer", transition: "background 0.2s" }}>
              <div style={{ position: "absolute", top: "2px", left: form.published ? "18px" : "2px", width: "16px", height: "16px", borderRadius: "50%", background: "#faf5ea", transition: "left 0.2s" }} />
            </div>
            <span style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "13px", color: "#bababa" }}>{form.published ? "Published" : "Draft"}</span>
          </label>
          <button onClick={handleSave} disabled={saving} style={{ fontFamily: '"Clash Display", sans-serif', fontSize: "13px", fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase", color: "#0a0a0a", background: saving ? "#666" : "#faf5ea", border: "none", padding: "12px 28px", cursor: saving ? "not-allowed" : "pointer", borderRadius: "4px" }}>
            {saving ? "Saving…" : isEditing ? "Save Changes" : "Publish Post"}
          </button>
        </div>
      </div>

      {error && (
        <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "6px", padding: "12px 16px", marginBottom: "24px" }}>
          <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "14px", color: "#ef4444" }}>{error}</p>
        </div>
      )}

      {/* Cover image */}
      <div style={section}>
        <p style={{ fontFamily: '"Clash Display", sans-serif', fontSize: "16px", color: "#faf5ea", marginBottom: "16px" }}>Cover Image</p>
        {form.cover_image ? (
          <div style={{ position: "relative", aspectRatio: "16/9", borderRadius: "6px", overflow: "hidden", marginBottom: "12px" }}>
            <Image src={form.cover_image} alt="Cover" fill style={{ objectFit: "cover" }} sizes="800px" />
            <button onClick={() => setForm(f => ({ ...f, cover_image: "" }))}
              style={{ position: "absolute", top: "12px", right: "12px", background: "rgba(0,0,0,0.7)", border: "none", color: "#faf5ea", cursor: "pointer", borderRadius: "4px", padding: "6px 10px", fontSize: "12px" }}>
              Remove
            </button>
          </div>
        ) : (
          <div
            onDragOver={e => e.preventDefault()}
            onDrop={handleCoverDrop}
            onClick={() => coverInputRef.current?.click()}
            style={{ border: "2px dashed rgba(255,255,255,0.15)", borderRadius: "8px", padding: "40px", textAlign: "center", cursor: "pointer", transition: "border-color 0.2s" }}
            onMouseEnter={el => (el.currentTarget.style.borderColor = "#ff7738")}
            onMouseLeave={el => (el.currentTarget.style.borderColor = "rgba(255,255,255,0.15)")}
          >
            <input ref={coverInputRef} type="file" accept="image/*" onChange={e => { const f = e.target.files?.[0]; if (f) handleCoverUpload(f); e.target.value = ""; }} style={{ display: "none" }} />
            {coverUploading ? (
              <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "14px", color: "#ff7738" }}>Uploading…</p>
            ) : (
              <>
                <p style={{ fontFamily: '"Clash Display", sans-serif', fontSize: "16px", color: "#faf5ea", marginBottom: "6px" }}>Drag & drop or click to upload</p>
                <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "13px", color: "#555" }}>JPG, PNG, WEBP — recommended 1200×630px</p>
              </>
            )}
          </div>
        )}
        {/* Or paste URL */}
        <div style={{ marginTop: "12px" }}>
          <label style={{ ...lbl, marginBottom: "6px" }}>Or paste image URL</label>
          <input value={form.cover_image} onChange={e => setForm(f => ({ ...f, cover_image: e.target.value }))} placeholder="https://…" style={inp} />
        </div>
      </div>

      {/* Title + Slug */}
      <div style={section}>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={lbl}>Title *</label>
            <input value={form.title} onChange={e => handleTitleChange(e.target.value)} placeholder="Post title" style={{ ...inp, fontSize: "18px" }} />
          </div>
          <div>
            <label style={lbl}>Slug *</label>
            <input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: slugify(e.target.value) }))} placeholder="post-slug" style={inp} />
            <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "11px", color: "#444", marginTop: "6px" }}>URL: /blog/{form.slug || "…"}</p>
          </div>
          <div>
            <label style={lbl}>Excerpt</label>
            <textarea value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))} rows={2} placeholder="Short description shown on the blog listing page…" style={{ ...inp, resize: "vertical" }} />
          </div>
          <div>
            <label style={lbl}>Tags (comma separated)</label>
            <input value={tagInput} onChange={e => setTagInput(e.target.value)} placeholder="Portrait, Behind the Scenes, Abuja…" style={inp} />
          </div>
        </div>
      </div>

      {/* Body editor */}
      <div style={section}>
        {/* Tab nav */}
        <div style={{ display: "flex", gap: "4px", background: "rgba(255,255,255,0.04)", borderRadius: "8px", padding: "4px", marginBottom: "20px", width: "fit-content" }}>
          {(["write", "preview", "seo"] as const).map(t => (
            <button key={t} onClick={() => setActiveTab(t)} style={tabStyle(t)}>
              {t === "write" ? "Write" : t === "preview" ? "Preview" : "SEO"}
            </button>
          ))}
        </div>

        {activeTab === "write" && (
          <div>
            <div style={{ display: "flex", gap: "8px", marginBottom: "12px", flexWrap: "wrap" }}>
              {[
                { label: "H2", insert: "## " }, { label: "H3", insert: "### " },
                { label: "Bold", insert: "**text**" }, { label: "Italic", insert: "*text*" },
                { label: "Link", insert: "[text](url)" }, { label: "Code", insert: "`code`" },
                { label: "List", insert: "- item" },
              ].map(btn => (
                <button key={btn.label} onClick={() => setForm(f => ({ ...f, body: f.body + (f.body ? "\n" : "") + btn.insert }))}
                  style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "12px", padding: "4px 10px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", color: "#bababa", cursor: "pointer", borderRadius: "3px" }}>
                  {btn.label}
                </button>
              ))}
            </div>
            <textarea
              value={form.body}
              onChange={e => setForm(f => ({ ...f, body: e.target.value }))}
              placeholder={`Write your post in Markdown…\n\n## Example heading\n\nParagraph text goes here.\n\n- List item one\n- List item two`}
              style={{ ...inp, minHeight: "480px", resize: "vertical", fontFamily: '"Fragment Mono", monospace', fontSize: "13px", lineHeight: 1.8 }}
            />
            <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "12px", color: "#333", marginTop: "8px" }}>
              Supports Markdown: **bold**, *italic*, ## headings, - lists, [links](url), `code`
            </p>
          </div>
        )}

        {activeTab === "preview" && (
          <div style={{ background: "#111", borderRadius: "6px", padding: "32px", minHeight: "300px" }}>
            {form.body ? (
              <div
                style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "16px", lineHeight: 1.8, color: "#bababa" }}
                dangerouslySetInnerHTML={{ __html: `<p style="margin: 0 0 20px; color: #bababa; line-height: 1.8; font-weight: 300;">${renderMarkdown(form.body)}</p>` }}
              />
            ) : (
              <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "14px", color: "#333" }}>Nothing to preview yet. Write something in the Write tab.</p>
            )}
          </div>
        )}

        {activeTab === "seo" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "13px", color: "#555", marginBottom: "4px" }}>
              Leave blank to use the post title and excerpt as defaults.
            </p>
            <div>
              <label style={lbl}>Meta Title</label>
              <input value={form.meta_title} onChange={e => setForm(f => ({ ...f, meta_title: e.target.value }))} placeholder={form.title || "SEO title…"} style={inp} />
              <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "11px", color: form.meta_title.length > 60 ? "#ef4444" : "#444", marginTop: "6px" }}>
                {form.meta_title.length}/60 characters
              </p>
            </div>
            <div>
              <label style={lbl}>Meta Description</label>
              <textarea value={form.meta_description} onChange={e => setForm(f => ({ ...f, meta_description: e.target.value }))} rows={3} placeholder={form.excerpt || "SEO description…"} style={{ ...inp, resize: "vertical" }} />
              <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "11px", color: form.meta_description.length > 160 ? "#ef4444" : "#444", marginTop: "6px" }}>
                {form.meta_description.length}/160 characters
              </p>
            </div>
            {/* Preview snippet */}
            <div style={{ background: "#111", borderRadius: "6px", padding: "16px", marginTop: "8px" }}>
              <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "11px", color: "#444", marginBottom: "10px", letterSpacing: "0.08em", textTransform: "uppercase" }}>Search Preview</p>
              <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "18px", color: "#60a5fa", marginBottom: "4px" }}>{form.meta_title || form.title || "Post Title"}</p>
              <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "13px", color: "#4ade80", marginBottom: "6px" }}>mykevisuals.com/blog/{form.slug || "post-slug"}</p>
              <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "14px", color: "#bababa" }}>{form.meta_description || form.excerpt || "Post excerpt or description…"}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  function renderMarkdown(md: string) {
    return md
      .replace(/^### (.+)/gm, '<h3 style="font-family: \'Clash Display\', sans-serif; font-size: 20px; color: #faf5ea; margin: 24px 0 12px; font-weight: 400;">$1</h3>')
      .replace(/^## (.+)/gm, '<h2 style="font-family: \'Clash Display\', sans-serif; font-size: 26px; color: #faf5ea; margin: 32px 0 16px; font-weight: 400;">$1</h2>')
      .replace(/^# (.+)/gm, '<h1 style="font-family: \'Clash Display\', sans-serif; font-size: 36px; color: #faf5ea; margin: 40px 0 20px; font-weight: 400;">$1</h1>')
      .replace(/\*\*(.+?)\*\*/g, '<strong style="color: #faf5ea; font-weight: 600;">$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`(.+?)`/g, '<code style="background: rgba(255,255,255,0.08); padding: 2px 6px; border-radius: 3px; font-size: 13px; color: #ff7738;">$1</code>')
      .replace(/^\- (.+)/gm, '<li style="margin-bottom: 6px;">$1</li>')
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" style="color: #ff7738;">$1</a>')
      .replace(/\n\n/g, '</p><p style="margin: 0 0 20px; color: #bababa; line-height: 1.8; font-weight: 300;">');
  }
}
