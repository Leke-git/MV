"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Album } from "@/types";

interface Props { albums: Album[]; }

// Corner bracket hover component
function CornerBrackets({ visible }: { visible: boolean }) {
  const s: React.CSSProperties = {
    position: "absolute", width: "20px", height: "20px",
    opacity: visible ? 1 : 0,
    transition: "opacity 0.25s ease",
    zIndex: 5,
  };
  const line: React.CSSProperties = {
    position: "absolute", background: "var(--color-text-primary)",
  };
  return (
    <>
      {/* Top-left */}
      <div style={{ ...s, top: "14px", left: "14px" }}>
        <div style={{ ...line, top: 0, left: 0, width: "2px", height: "100%" }} />
        <div style={{ ...line, top: 0, left: 0, width: "100%", height: "2px" }} />
      </div>
      {/* Top-right */}
      <div style={{ ...s, top: "14px", right: "14px" }}>
        <div style={{ ...line, top: 0, right: 0, width: "2px", height: "100%" }} />
        <div style={{ ...line, top: 0, right: 0, width: "100%", height: "2px" }} />
      </div>
      {/* Bottom-left */}
      <div style={{ ...s, bottom: "14px", left: "14px" }}>
        <div style={{ ...line, bottom: 0, left: 0, width: "2px", height: "100%" }} />
        <div style={{ ...line, bottom: 0, left: 0, width: "100%", height: "2px" }} />
      </div>
      {/* Bottom-right */}
      <div style={{ ...s, bottom: "14px", right: "14px" }}>
        <div style={{ ...line, bottom: 0, right: 0, width: "2px", height: "100%" }} />
        <div style={{ ...line, bottom: 0, right: 0, width: "100%", height: "2px" }} />
      </div>
    </>
  );
}

// Custom cursor
function CustomCursor({ x, y, visible, label }: { x: number; y: number; visible: boolean; label: string }) {
  return (
    <div style={{
      position: "fixed", left: x, top: y,
      width: "72px", height: "72px",
      borderRadius: "50%",
      background: "var(--color-text-primary)",
      color: "var(--color-bg)",
      display: "flex", alignItems: "center", justifyContent: "center",
      pointerEvents: "none", zIndex: 9999,
      transform: "translate(-50%, -50%)",
      opacity: visible ? 1 : 0,
      transition: "opacity 0.2s ease",
      fontFamily: "var(--font-display)",
      fontSize: "11px", fontWeight: 600,
      letterSpacing: "0.1em",
    }}>
      {label}
    </div>
  );
}

function AlbumCard({ album }: { album: Partial<Album> & { id: string; title: string; slug: string } }) {
  const [hovered, setHovered] = useState(false);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setCursor({ x: e.clientX, y: e.clientY });
  }, []);

  return (
    <>
      <CustomCursor x={cursor.x} y={cursor.y} visible={hovered} label="VIEW" />
      <Link
        href={`/albums/${album.slug}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onMouseMove={handleMouseMove}
        style={{
          display: "block", position: "relative",
          overflow: "hidden", aspectRatio: "4/5", cursor: "none",
        }}
      >
        <Image
          src={(album as Album).cover_image || "/assets/images/placeholder.jpg"}
          alt={album.title} fill
          style={{ objectFit: "cover", transition: "transform 0.7s ease",
            transform: hovered ? "scale(1.04)" : "scale(1)" }}
          sizes="(max-width: 809px) 100vw, 50vw"
        />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 55%)",
          zIndex: 1,
        }} />

        <CornerBrackets visible={hovered} />

        {/* Tags — bottom left above title */}
        <div style={{
          position: "absolute", bottom: "60px", left: "20px",
          zIndex: 2, display: "flex", gap: "8px", flexWrap: "wrap",
        }}>
          {[(album as Album).category, (album as Album).project_type]
            .filter(Boolean).map(tag => (
              <span key={tag} style={{
                fontFamily: "var(--font-mono)", fontSize: "11px",
                letterSpacing: "0.08em", textTransform: "uppercase",
                color: "var(--color-text-primary)",
                background: "rgba(0,0,0,0.5)",
                padding: "4px 10px", backdropFilter: "blur(8px)",
              }}>{tag}</span>
            ))}
        </div>

        {/* Title + arrow */}
        <div style={{
          position: "absolute", bottom: "20px", left: "20px", right: "20px", zIndex: 2,
          display: "flex", justifyContent: "space-between", alignItems: "flex-end",
        }}>
          <h3 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(20px, 2.5vw, 28px)",
            fontWeight: 400, letterSpacing: "-0.02em", lineHeight: 1.2,
            color: "var(--color-text-primary)",
          }}>
            {album.title}
          </h3>
          <span style={{
            color: "var(--color-text-primary)", fontSize: "20px",
            opacity: hovered ? 1 : 0, transition: "opacity 0.25s ease",
          }}>↗</span>
        </div>
      </Link>
    </>
  );
}

export default function AlbumsSection({ albums }: Props) {
  const displayAlbums = albums.length > 0 ? albums : [
    { id: "1", title: "Beautiful People", slug: "beautiful-people", category: "Portraits", project_type: "Personal", cover_image: "/assets/images/album-cover-1.jpg" },
    { id: "2", title: "Together Forever", slug: "together-forever", category: "Wedding", project_type: "Events", cover_image: "/assets/images/album-cover-2.jpg" },
    { id: "3", title: "The Edit", slug: "the-edit", category: "Fashion", project_type: "Editorial", cover_image: "/assets/images/album-cover-3.jpg" },
    { id: "4", title: "The Brand Speaks", slug: "the-brand-speaks", category: "Commercial", project_type: "Brand Collaboration", cover_image: "/assets/images/album-cover-4.jpg" },
  ];

  return (
    <section style={{ background: "var(--color-bg)", padding: "0 40px 150px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "flex-end",
          marginBottom: "40px", paddingBottom: "16px",
          borderBottom: "1px solid var(--color-border-subtle)",
        }}>
          <h2 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(36px, 5.5vw, 64px)",
            fontWeight: 400, letterSpacing: "-0.045em", lineHeight: 0.9,
            color: "var(--color-accent-light)",
          }}>
            Albums
          </h2>
          <Link href="/albums" style={{
            fontFamily: "var(--font-display)", fontSize: "13px",
            fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase",
            color: "var(--color-text-muted)",
            borderBottom: "1px solid var(--color-border-subtle)", paddingBottom: "2px",
          }}>
            View All
          </Link>
        </div>

        {/* Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" }}>
          {displayAlbums.map(album => <AlbumCard key={album.id} album={album} />)}
        </div>
      </div>

      <style>{`
        @media (max-width: 809px) {
          section > div > div:last-child { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
