import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import PublicLayout from "@/components/layout/PublicLayout";
import { getAlbumBySlug, getAlbums } from "@/lib/queries";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  // Returns empty at build time when env vars not set — pages generated on-demand
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) return [];
  const { createAdminClient } = await import("@/lib/supabase/server");
  const supabase = createAdminClient();
  const { data } = await supabase.from("albums").select("slug").eq("published", true);
  return (data || []).map((a: { slug: string }) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const album = await getAlbumBySlug(slug);
  if (!album) return { title: "Album Not Found" };
  return {
    title: album.title,
    description: album.overview || `${album.title} — Photography by Myke Visuals`,
    openGraph: {
      images: album.cover_image ? [{ url: album.cover_image }] : [],
    },
  };
}

export default async function AlbumPage({ params }: Props) {
  const { slug } = await params;
  const album = await getAlbumBySlug(slug);
  if (!album) notFound();

  const allImages = [album.cover_image, ...(album.images || [])].filter(Boolean);

  return (
    <PublicLayout heroPadding>
      {/* Hero */}
      <section style={{ position: "relative", height: "100vh", minHeight: "500px", overflow: "hidden" }}>
        <Image src={album.cover_image || "/assets/images/placeholder.jpg"} alt={album.title} fill priority style={{ objectFit: "cover" }} sizes="100vw" />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.6))", zIndex: 1 }} />
        <div style={{ position: "absolute", bottom: "60px", left: "40px", right: "40px", zIndex: 2 }}>
          <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
            {[album.category, album.project_type].filter(Boolean).map((tag) => (
              <span key={tag} style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-text-primary)", background: "rgba(0,0,0,0.5)", padding: "4px 12px", backdropFilter: "blur(8px)" }}>{tag}</span>
            ))}
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(48px, 10vw, 120px)", fontWeight: 400, letterSpacing: "-0.05em", lineHeight: 0.9, color: "var(--color-text-primary)" }}>{album.title}</h1>
        </div>
      </section>

      {/* Details */}
      <section style={{ background: "var(--color-bg)", padding: "80px 40px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", gap: "80px", flexWrap: "wrap" }}>
          {/* Overview */}
          {album.overview && (
            <div style={{ flex: "1 1 400px" }}>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "clamp(16px, 2vw, 22px)", fontWeight: 300, color: "var(--color-text-primary)", lineHeight: 1.6 }}>{album.overview}</p>
              {album.button_link && (
                <Link href={album.button_link} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", marginTop: "32px", fontFamily: "var(--font-display)", fontSize: "13px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-bg)", background: "var(--color-text-primary)", padding: "14px 28px" }}>
                  {album.button_text || "View Project"}
                </Link>
              )}
            </div>
          )}

          {/* Metadata */}
          <div style={{ flex: "0 0 auto", minWidth: "200px" }}>
            {[
              { label: "Client", value: album.client },
              { label: "Year", value: album.year },
              { label: "Location", value: album.location },
              { label: "Camera", value: album.camera },
              { label: "Lenses", value: album.lenses },
            ].filter(({ value }) => value).map(({ label, value }) => (
              <div key={label} style={{ marginBottom: "16px", borderBottom: "1px solid var(--color-border-subtle)", paddingBottom: "12px" }}>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-text-muted)", marginBottom: "4px" }}>{label}</p>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "15px", color: "var(--color-text-primary)" }}>{String(value)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      {allImages.length > 0 && (
        <section style={{ background: "var(--color-bg)", padding: "0 40px 150px" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }}>
            {allImages.map((img, i) => (
              <div key={i} style={{ position: "relative", aspectRatio: i % 5 === 0 ? "16/9" : "4/5", overflow: "hidden", gridColumn: i % 5 === 0 ? "span 2" : "span 1" }}>
                <Image src={img} alt={`${album.title} ${i + 1}`} fill style={{ objectFit: "cover" }} sizes="(max-width: 809px) 100vw, 50vw" />
              </div>
            ))}
          </div>
        </section>
      )}
    </PublicLayout>
  );
}
