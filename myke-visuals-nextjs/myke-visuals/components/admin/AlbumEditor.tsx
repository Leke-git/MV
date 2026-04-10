"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import type { Album } from "@/types";

// ─── Types ───────────────────────────────────────────────────
interface Props {
  album?: Album; // undefined = new album
}

interface FormData {
  title: string;
  slug: string;
  overview: string;
  year: string;
  location: string;
  camera: string;
  lenses: string;
  other_devices: string;
  client: string;
  category: string;
  project_type: string;
  button_text: string;
  button_link: string;
  youtube_link: string;
  published: boolean;
}

interface ImageItem {
  url: string;
  uploading?: boolean;
  error?: string;
  file?: File;
  preview?: string;
}

// ─── Helpers ─────────────────────────────────────────────────
function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

async function uploadToSupabase(file: File, supabase: ReturnType<typeof createClient>): Promise<string> {
  const ext = file.name.split(".").pop();
  const filename = `albums/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage.from("images").upload(filename, file, {
    cacheControl: "3600",
    upsert: false,
  });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from("images").getPublicUrl(filename);
  return data.publicUrl;
}

// ─── Styles ──────────────────────────────────────────────────
const S = {
  label: {
    fontFamily: '"Satoshi", sans-serif',
    fontSize: "11px",
    fontWeight: 500,
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
    color: "#bababa",
    display: "block",
    marginBottom: "8px",
  },
  input: {
    width: "100%",
    background: "#111",
    border: "1px solid rgba(255,255,255,0.08)",
    color: "#faf5ea",
    fontFamily: '"Satoshi", sans-serif',
    fontSize: "14px",
    padding: "12px 14px",
    outline: "none",
    borderRadius: "4px",
    transition: "border-color 0.15s",
  },
  textarea: {
    width: "100%",
    background: "#111",
    border: "1px solid rgba(255,255,255,0.08)",
    color: "#faf5ea",
    fontFamily: '"Satoshi", sans-serif',
    fontSize: "14px",
    padding: "12px 14px",
    outline: "none",
    borderRadius: "4px",
    resize: "vertical" as const,
    minHeight: "100px",
  },
  section: {
    background: "#1a1a1a",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "8px",
    padding: "28px",
    marginBottom: "24px",
  },
  sectionTitle: {
    fontFamily: '"Clash Display", sans-serif',
    fontSize: "16px",
    fontWeight: 400,
    letterSpacing: "-0.01em",
    color: "#faf5ea",
    marginBottom: "24px",
  },
  grid2: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
  },
};

// ─── Image Drop Zone ─────────────────────────────────────────
function ImageDropZone({
  images,
  onAdd,
  onRemove,
  onSetCover,
  coverUrl,
  maxImages = 20,
}: {
  images: ImageItem[];
  onAdd: (files: File[]) => void;
  onRemove: (index: number) => void;
  onSetCover: (url: string) => void;
  coverUrl: string;
  maxImages?: number;
}) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const files = Array.from(e.dataTransfer.files).filter((f) =>
        f.type.startsWith("image/")
      );
      if (files.length) onAdd(files);
    },
    [onAdd]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length) onAdd(files);
    e.target.value = "";
  };

  const remaining = maxImages - images.length;

  return (
    <div>
      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        style={{
          border: `2px dashed ${dragging ? "#ff7738" : "rgba(255,255,255,0.15)"}`,
          borderRadius: "8px",
          padding: "40px",
          textAlign: "center",
          cursor: "pointer",
          background: dragging ? "rgba(255,119,56,0.05)" : "transparent",
          transition: "all 0.2s",
          marginBottom: "20px",
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileInput}
          style={{ display: "none" }}
        />
        <p style={{ fontFamily: '"Clash Display", sans-serif', fontSize: "18px", color: "#faf5ea", marginBottom: "8px" }}>
          {dragging ? "Drop images here" : "Drag & drop images"}
        </p>
        <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "13px", color: "#bababa" }}>
          or click to browse · {remaining} slot{remaining !== 1 ? "s" : ""} remaining · JPG, PNG, WEBP
        </p>
      </div>

      {/* Image grid */}
      {images.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
          {images.map((img, i) => {
            const isCover = img.url === coverUrl || (img.url === "" && img.preview === coverUrl);
            const displaySrc = img.preview || img.url;
            return (
              <div
                key={i}
                style={{
                  position: "relative",
                  aspectRatio: "1",
                  borderRadius: "6px",
                  overflow: "hidden",
                  background: "#111",
                  border: isCover ? "2px solid #ff7738" : "2px solid transparent",
                }}
              >
                {displaySrc && (
                  <Image
                    src={displaySrc}
                    alt={`Image ${i + 1}`}
                    fill
                    style={{ objectFit: "cover", opacity: img.uploading ? 0.4 : 1 }}
                    sizes="25vw"
                    unoptimized={!!img.preview}
                  />
                )}

                {/* Upload overlay */}
                {img.uploading && (
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ width: "24px", height: "24px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#ff7738", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                  </div>
                )}

                {/* Error overlay */}
                {img.error && (
                  <div style={{ position: "absolute", inset: 0, background: "rgba(220,38,38,0.7)", display: "flex", alignItems: "center", justifyContent: "center", padding: "8px" }}>
                    <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "11px", color: "#fff", textAlign: "center" }}>Upload failed</p>
                  </div>
                )}

                {/* Actions — only show when not uploading */}
                {!img.uploading && !img.error && img.url && (
                  <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0)", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "6px", opacity: 0, transition: "opacity 0.15s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = "0")}
                  >
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); onRemove(i); }}
                      style={{ alignSelf: "flex-end", background: "rgba(0,0,0,0.7)", border: "none", color: "#faf5ea", cursor: "pointer", borderRadius: "4px", padding: "4px 6px", fontSize: "12px" }}
                    >
                      ✕
                    </button>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); onSetCover(img.url); }}
                      style={{ alignSelf: "center", background: isCover ? "#ff7738" : "rgba(0,0,0,0.7)", border: "none", color: isCover ? "#0a0a0a" : "#faf5ea", cursor: "pointer", borderRadius: "4px", padding: "4px 8px", fontFamily: '"Satoshi", sans-serif', fontSize: "10px", letterSpacing: "0.05em", textTransform: "uppercase" }}
                    >
                      {isCover ? "✓ Cover" : "Set Cover"}
                    </button>
                  </div>
                )}

                {/* Cover badge */}
                {isCover && !img.uploading && (
                  <div style={{ position: "absolute", top: "6px", left: "6px", background: "#ff7738", borderRadius: "3px", padding: "2px 6px" }}>
                    <span style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "9px", letterSpacing: "0.06em", textTransform: "uppercase", color: "#0a0a0a", fontWeight: 600 }}>Cover</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ─── Main Editor ─────────────────────────────────────────────
export default function AlbumEditor({ album }: Props) {
  const router = useRouter();
  const supabase = createClient();
  const isEditing = !!album;

  const [form, setForm] = useState<FormData>({
    title: album?.title || "",
    slug: album?.slug || "",
    overview: album?.overview || "",
    year: album?.year?.toString() || new Date().getFullYear().toString(),
    location: album?.location || "",
    camera: album?.camera || "",
    lenses: album?.lenses || "",
    other_devices: album?.other_devices || "",
    client: album?.client || "",
    category: album?.category || "",
    project_type: album?.project_type || "",
    button_text: album?.button_text || "View Project",
    button_link: album?.button_link || "",
    youtube_link: album?.youtube_link || "",
    published: album?.published || false,
  });

  const [images, setImages] = useState<ImageItem[]>(
    (album?.images || []).map((url) => ({ url }))
  );
  const [coverUrl, setCoverUrl] = useState(album?.cover_image || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  // Auto-generate slug from title (only for new albums)
  const handleTitleChange = (value: string) => {
    setForm((f) => ({
      ...f,
      title: value,
      slug: isEditing ? f.slug : slugify(value),
    }));
  };

  // Upload files one by one, updating UI as each completes
  const handleAddImages = useCallback(async (files: File[]) => {
    const remaining = 20 - images.filter(i => !i.error).length;
    const toUpload = files.slice(0, remaining);
    if (!toUpload.length) return;

    // Add placeholder items immediately
    const placeholders: ImageItem[] = toUpload.map((file) => ({
      url: "",
      uploading: true,
      file,
      preview: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...placeholders]);

    // Upload each file
    for (let i = 0; i < toUpload.length; i++) {
      const file = toUpload[i];
      try {
        const url = await uploadToSupabase(file, supabase);
        setImages((prev) => {
          const idx = prev.findIndex((img) => img.file === file);
          if (idx === -1) return prev;
          const next = [...prev];
          next[idx] = { url, uploading: false };
          // Auto-set cover if none set yet
          if (!coverUrl && i === 0) setCoverUrl(url);
          return next;
        });
      } catch {
        setImages((prev) => {
          const idx = prev.findIndex((img) => img.file === file);
          if (idx === -1) return prev;
          const next = [...prev];
          next[idx] = { ...next[idx], uploading: false, error: "Upload failed" };
          return next;
        });
      }
    }
  }, [images, coverUrl, supabase]);

  const handleRemoveImage = (index: number) => {
    setImages((prev) => {
      const next = [...prev];
      const removed = next.splice(index, 1)[0];
      if (removed.url === coverUrl) {
        // Auto-assign cover to next available image
        const nextCover = next.find((i) => i.url && !i.error);
        setCoverUrl(nextCover?.url || "");
      }
      if (removed.preview) URL.revokeObjectURL(removed.preview);
      return next;
    });
  };

  const handleSave = async () => {
    if (!form.title.trim()) { setError("Title is required."); return; }
    if (!form.slug.trim()) { setError("Slug is required."); return; }

    const uploading = images.some((i) => i.uploading);
    if (uploading) { setError("Please wait for all images to finish uploading."); return; }

    setSaving(true);
    setError("");

    const payload = {
      title: form.title.trim(),
      slug: form.slug.trim(),
      overview: form.overview.trim(),
      year: form.year ? parseInt(form.year) : null,
      location: form.location.trim(),
      camera: form.camera.trim(),
      lenses: form.lenses.trim(),
      other_devices: form.other_devices.trim(),
      client: form.client.trim(),
      category: form.category.trim(),
      project_type: form.project_type.trim(),
      button_text: form.button_text.trim(),
      button_link: form.button_link.trim(),
      youtube_link: form.youtube_link.trim(),
      published: form.published,
      images: images.filter((i) => i.url && !i.error).map((i) => i.url),
      cover_image: coverUrl || images.find((i) => i.url)?.url || "",
    };

    let result;
    if (isEditing) {
      result = await supabase.from("albums").update(payload).eq("id", album.id);
    } else {
      result = await supabase.from("albums").insert(payload);
    }

    if (result.error) {
      setError(result.error.message);
      setSaving(false);
      return;
    }

    router.push("/admin/albums");
    router.refresh();
  };

  const handleDelete = async () => {
    if (!album) return;
    if (!confirm(`Delete "${album.title}"? This cannot be undone.`)) return;
    setDeleting(true);
    await supabase.from("albums").delete().eq("id", album.id);
    router.push("/admin/albums");
    router.refresh();
  };

  const field = (key: keyof FormData, label: string, opts?: { placeholder?: string; type?: string }) => (
    <div>
      <label style={S.label}>{label}</label>
      <input
        type={opts?.type || "text"}
        value={form[key] as string}
        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
        placeholder={opts?.placeholder}
        style={S.input}
      />
    </div>
  );

  return (
    <div style={{ maxWidth: "900px" }}>
      {/* Header */}
      <div style={{ marginBottom: "40px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <button
            type="button"
            onClick={() => router.push("/admin/albums")}
            style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "13px", color: "#bababa", background: "none", border: "none", cursor: "pointer", padding: 0, marginBottom: "12px", display: "block" }}
          >
            ← Back to Albums
          </button>
          <h1 style={{ fontFamily: '"Clash Display", sans-serif', fontSize: "32px", fontWeight: 400, letterSpacing: "-0.03em", color: "#faf5ea" }}>
            {isEditing ? "Edit Album" : "New Album"}
          </h1>
        </div>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          {isEditing && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "13px", color: "#ef4444", background: "none", border: "1px solid rgba(239,68,68,0.3)", padding: "10px 20px", cursor: "pointer", borderRadius: "4px" }}
            >
              {deleting ? "Deleting..." : "Delete"}
            </button>
          )}
          {/* Published toggle */}
          <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
            <span style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "13px", color: "#bababa" }}>
              {form.published ? "Published" : "Draft"}
            </span>
            <div
              onClick={() => setForm((f) => ({ ...f, published: !f.published }))}
              style={{
                width: "44px", height: "24px", borderRadius: "12px",
                background: form.published ? "#ff7738" : "rgba(255,255,255,0.1)",
                position: "relative", cursor: "pointer", transition: "background 0.2s",
              }}
            >
              <div style={{
                position: "absolute", top: "3px",
                left: form.published ? "23px" : "3px",
                width: "18px", height: "18px", borderRadius: "50%",
                background: "#faf5ea", transition: "left 0.2s",
              }} />
            </div>
          </label>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            style={{
              fontFamily: '"Clash Display", sans-serif', fontSize: "13px", fontWeight: 500,
              letterSpacing: "0.05em", textTransform: "uppercase",
              color: "#0a0a0a", background: saving ? "#bababa" : "#faf5ea",
              border: "none", padding: "12px 28px", cursor: saving ? "not-allowed" : "pointer",
              borderRadius: "4px",
            }}
          >
            {saving ? "Saving…" : isEditing ? "Save Changes" : "Create Album"}
          </button>
        </div>
      </div>

      {error && (
        <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "6px", padding: "12px 16px", marginBottom: "24px" }}>
          <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "14px", color: "#ef4444" }}>{error}</p>
        </div>
      )}

      {/* Images */}
      <div style={S.section}>
        <p style={S.sectionTitle}>Images</p>
        <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "13px", color: "#bababa", marginBottom: "20px" }}>
          Upload up to 20 images. Hover an image to set it as the cover or remove it. The cover appears on the albums listing page.
        </p>
        <ImageDropZone
          images={images}
          onAdd={handleAddImages}
          onRemove={handleRemoveImage}
          onSetCover={setCoverUrl}
          coverUrl={coverUrl}
        />
      </div>

      {/* Core Details */}
      <div style={S.section}>
        <p style={S.sectionTitle}>Details</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {field("title", "Title *", { placeholder: "Beautiful People" })}
          <div style={S.grid2}>
            <div>
              <label style={S.label}>Slug *</label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: slugify(e.target.value) }))}
                placeholder="beautiful-people"
                style={S.input}
              />
              <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "11px", color: "#666", marginTop: "6px" }}>
                URL: /albums/{form.slug || "…"}
              </p>
            </div>
            {field("year", "Year", { placeholder: "2024", type: "number" })}
          </div>
          <div>
            <label style={S.label}>Overview</label>
            <textarea
              value={form.overview}
              onChange={(e) => setForm((f) => ({ ...f, overview: e.target.value }))}
              placeholder="A short description of the album…"
              style={S.textarea}
              rows={4}
            />
          </div>
          <div style={S.grid2}>
            {field("client", "Client", { placeholder: "Brand name or person" })}
            {field("location", "Location", { placeholder: "Abuja, Nigeria" })}
          </div>
          <div style={S.grid2}>
            {field("category", "Category", { placeholder: "Portrait, Commercial, Wedding…" })}
            {field("project_type", "Project Type", { placeholder: "Editorial, Campaign…" })}
          </div>
        </div>
      </div>

      {/* Gear */}
      <div style={S.section}>
        <p style={S.sectionTitle}>Gear</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {field("camera", "Camera", { placeholder: "Sony A7 IV" })}
          {field("lenses", "Lenses", { placeholder: "Sony 35mm f/1.4, Sigma 85mm f/1.4" })}
          {field("other_devices", "Other Devices", { placeholder: "DJI RS3 Gimbal, Godox AD300 Pro" })}
        </div>
      </div>

      {/* CTA */}
      <div style={S.section}>
        <p style={S.sectionTitle}>Call to Action</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={S.grid2}>
            {field("button_text", "Button Text", { placeholder: "View Project" })}
            {field("button_link", "Button Link", { placeholder: "https://…" })}
          </div>
          {field("youtube_link", "YouTube Link", { placeholder: "https://youtube.com/…" })}
        </div>
      </div>
    </div>
  );
}
