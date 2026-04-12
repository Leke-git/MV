import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PublicLayout from "@/components/layout/PublicLayout";
import { getAlbums } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Works",
  description: "Browse Myke Visuals' portfolio — portraits, weddings, fashion editorials, and commercial brand photography in Abuja, Nigeria.",
};

export default async function AlbumsPage() {
  const albums = await getAlbums();

  return (
    <PublicLayout heroPadding>
      <section style={{ background: "var(--color-bg)", padding: "120px 40px 150px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ marginBottom: "60px" }}>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--color-accent)", marginBottom: "16px" }}>PORTFOLIO</p>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(40px, 8vw, 100px)", fontWeight: 400, letterSpacing: "-0.05em", lineHeight: 0.9, color: "var(--color-text-primary)" }}>
              Albums
            </h1>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" }}>
            {albums.map((album) => (
              <Link key={album.id} href={`/albums/${album.slug}`} style={{ display: "block", position: "relative", overflow: "hidden", aspectRatio: "4/5", cursor: "pointer" }}>
                <Image
                  src={album.cover_image || "/assets/images/placeholder.jpg"}
                  alt={album.title}
                  fill
                  style={{ objectFit: "cover", transition: "transform 0.6s ease" }}
                  sizes="(max-width: 809px) 100vw, 50vw"
                />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)", zIndex: 1 }} />
                <div style={{ position: "absolute", top: "16px", left: "16px", zIndex: 2, display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {[album.category, album.project_type].filter(Boolean).map((tag) => (
                    <span key={tag} style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-text-primary)", background: "rgba(0,0,0,0.5)", padding: "4px 10px", backdropFilter: "blur(8px)" }}>{tag}</span>
                  ))}
                </div>
                <div style={{ position: "absolute", bottom: "20px", left: "20px", right: "20px", zIndex: 2 }}>
                  <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(20px, 3vw, 32px)", fontWeight: 400, letterSpacing: "-0.02em", lineHeight: 1.2, color: "var(--color-text-primary)" }}>{album.title}</h2>
                </div>
              </Link>
            ))}
          </div>

          {albums.length === 0 && (
            <p style={{ fontFamily: "var(--font-body)", fontSize: "16px", color: "var(--color-text-muted)", textAlign: "center", padding: "80px 0" }}>
              Albums coming soon.
            </p>
          )}
        </div>
      </section>
      <style>{`@media (max-width: 809px) { .albums-grid { grid-template-columns: 1fr !important; } }`}</style>
    </PublicLayout>
  );
}
