export const dynamic = "force-dynamic";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Albums — Admin" };

export default async function AdminAlbumsPage() {
  const supabase = await createServerSupabaseClient();
  const { data: albums } = await supabase
    .from("albums")
    .select("*")
    .order("created_at", { ascending: false });

  const list = albums || [];

  return (
    <div>
      <div style={{ marginBottom: "40px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ fontFamily: '"Clash Display", sans-serif', fontSize: "32px", fontWeight: 400, letterSpacing: "-0.03em", color: "#faf5ea" }}>Albums</h1>
        <Link href="/admin/albums/new" style={{ fontFamily: '"Clash Display", sans-serif', fontSize: "13px", fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase", color: "#0a0a0a", background: "#faf5ea", padding: "12px 24px", textDecoration: "none" }}>
          + New Album
        </Link>
      </div>

      {list.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 40px", background: "#1a1a1a", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.07)" }}>
          <p style={{ fontFamily: '"Clash Display", sans-serif', fontSize: "20px", color: "#faf5ea", marginBottom: "12px" }}>No albums yet</p>
          <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "14px", color: "#bababa", marginBottom: "24px" }}>Add your first album to populate the portfolio.</p>
          <Link href="/admin/albums/new" style={{ fontFamily: '"Clash Display", sans-serif', fontSize: "13px", fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase", color: "#0a0a0a", background: "#ff7738", padding: "12px 24px", textDecoration: "none" }}>
            Create First Album
          </Link>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
          {list.map((album) => (
            <div key={album.id} style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "8px", overflow: "hidden" }}>
              {/* Cover */}
              <div style={{ position: "relative", aspectRatio: "4/3", background: "#111" }}>
                {album.cover_image ? (
                  <Image src={album.cover_image} alt={album.title} fill style={{ objectFit: "cover" }} sizes="33vw" />
                ) : (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#bababa" }}>
                    <span style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "13px" }}>No cover image</span>
                  </div>
                )}
                <div style={{ position: "absolute", top: "12px", right: "12px" }}>
                  <span style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "11px", letterSpacing: "0.05em", textTransform: "uppercase", color: album.published ? "#4ade80" : "#bababa", background: "rgba(0,0,0,0.7)", padding: "3px 8px", borderRadius: "3px" }}>
                    {album.published ? "Published" : "Draft"}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div style={{ padding: "16px" }}>
                <p style={{ fontFamily: '"Clash Display", sans-serif', fontSize: "16px", fontWeight: 400, letterSpacing: "-0.01em", color: "#faf5ea", marginBottom: "4px" }}>{album.title}</p>
                <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "12px", color: "#bababa", marginBottom: "16px" }}>
                  {[album.category, album.year].filter(Boolean).join(" · ")}
                </p>
                <div style={{ display: "flex", gap: "12px" }}>
                  <Link href={`/admin/albums/${album.id}/edit`} style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "13px", color: "#ff7738", textDecoration: "none" }}>Edit</Link>
                  <Link href={`/albums/${album.slug}`} target="_blank" style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "13px", color: "#bababa", textDecoration: "none" }}>View ↗</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
