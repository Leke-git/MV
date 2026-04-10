import Link from "next/link";
import Image from "next/image";
import type { Album } from "@/types";

interface Props {
  albums: Album[];
}

export default function AlbumsSection({ albums }: Props) {
  // Fallback static albums when DB is empty (mirrors current Framer site)
  const displayAlbums =
    albums.length > 0
      ? albums
      : [
          {
            id: "1",
            title: "Beautiful People",
            slug: "beautiful-people",
            category: "Portraits",
            project_type: "Personal",
            cover_image: "/assets/images/album-cover-1.jpg",
          },
          {
            id: "2",
            title: "Together Forever",
            slug: "together-forever",
            category: "Wedding",
            project_type: "Events",
            cover_image: "/assets/images/album-cover-2.jpg",
          },
          {
            id: "3",
            title: "Editorial",
            slug: "the-edit",
            category: "Fashion",
            project_type: "Editorial",
            cover_image: "/assets/images/album-cover-3.jpg",
          },
          {
            id: "4",
            title: "Brand Visuals",
            slug: "brand-visuals",
            category: "Commercial",
            project_type: "Brand Collaboration",
            cover_image: "/assets/images/album-cover-4.jpg",
          },
        ];

  return (
    <section
      style={{
        background: "var(--color-bg)",
        padding: "0 40px 150px",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Section header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: "40px",
            paddingBottom: "16px",
            borderBottom: "1px solid var(--color-border-subtle)",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(32px, 5vw, 56px)",
              fontWeight: 400,
              letterSpacing: "-0.04em",
              lineHeight: 1,
              color: "var(--color-text-primary)",
            }}
          >
            Albums
          </h2>
          <Link
            href="/albums"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "13px",
              fontWeight: 500,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              color: "var(--color-text-muted)",
              borderBottom: "1px solid var(--color-border-subtle)",
              paddingBottom: "2px",
            }}
          >
            View All
          </Link>
        </div>

        {/* Albums grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "12px",
          }}
        >
          {displayAlbums.map((album) => (
            <Link
              key={album.id}
              href={`/albums/${album.slug}`}
              style={{
                display: "block",
                position: "relative",
                overflow: "hidden",
                aspectRatio: "4/5",
                cursor: "pointer",
              }}
            >
              {/* Cover image */}
              <Image
                src={(album as Album).cover_image || "/assets/images/placeholder.jpg"}
                alt={album.title}
                fill
                style={{
                  objectFit: "cover",
                  transition: "transform 0.6s ease",
                }}
                sizes="(max-width: 809px) 100vw, 50vw"
              />

              {/* Overlay */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)",
                  zIndex: 1,
                }}
              />

              {/* Tags */}
              <div
                style={{
                  position: "absolute",
                  top: "16px",
                  left: "16px",
                  zIndex: 2,
                  display: "flex",
                  gap: "8px",
                  flexWrap: "wrap",
                }}
              >
                {[(album as Album).category, (album as Album).project_type]
                  .filter(Boolean)
                  .map((tag) => (
                    <span
                      key={tag}
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "11px",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: "var(--color-text-primary)",
                        background: "rgba(0,0,0,0.5)",
                        padding: "4px 10px",
                        backdropFilter: "blur(8px)",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
              </div>

              {/* Title */}
              <div
                style={{
                  position: "absolute",
                  bottom: "20px",
                  left: "20px",
                  right: "20px",
                  zIndex: 2,
                }}
              >
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(20px, 3vw, 28px)",
                    fontWeight: 400,
                    letterSpacing: "-0.02em",
                    lineHeight: 1.2,
                    color: "var(--color-text-primary)",
                  }}
                >
                  {album.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 809px) {
          section > div > div:last-child {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
