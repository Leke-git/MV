import Image from "next/image";
import Link from "next/link";

const extras = [
  {
    title: "Studio Hire",
    description:
      "Book Myke Visuals Studio by the hour — fully equipped with lighting, backdrops, a cyclorama wall, and changing room.",
    image: "/assets/images/studio-hire.jpg",
    href: "/studio",
  },
  {
    title: "Equipment Rental",
    description:
      "Need gear without the full studio booking? Equipment is available to rent separately.",
    image: "/assets/images/equipment-rental.jpg",
    href: "/studio#equipment",
  },
  {
    title: "Content Creation",
    description:
      "Social-first visual content for creators, influencers, and brands built for the scroll.",
    image: "/assets/images/content-creation.jpg",
    href: "/contact",
  },
  {
    title: "On-Location Shoots",
    description:
      "Myke is available for destination and on-location shoots across Nigeria and internationally.",
    image: "/assets/images/on-location.jpg",
    href: "/contact",
  },
];

export default function ExtraServicesSection() {
  return (
    <section
      style={{
        background: "var(--color-bg)",
        padding: "0 40px 150px",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: "60px" }}>
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(28px, 4vw, 48px)",
              fontWeight: 400,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              color: "var(--color-text-primary)",
            }}
          >
            Wait… There&apos;s more!
          </p>
        </div>

        {/* Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "12px",
          }}
        >
          {extras.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              style={{
                display: "block",
                position: "relative",
                overflow: "hidden",
                aspectRatio: "4/3",
                cursor: "pointer",
              }}
            >
              {/* [README] Replace with actual images */}
              <Image
                src={item.image}
                alt={item.title}
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
                    "linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 55%)",
                  zIndex: 1,
                }}
              />

              {/* Content */}
              <div
                style={{
                  position: "absolute",
                  bottom: "24px",
                  left: "24px",
                  right: "24px",
                  zIndex: 2,
                }}
              >
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(18px, 2.5vw, 26px)",
                    fontWeight: 400,
                    letterSpacing: "-0.02em",
                    lineHeight: 1.2,
                    color: "var(--color-text-primary)",
                    marginBottom: "8px",
                  }}
                >
                  {item.title}
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "14px",
                    fontWeight: 300,
                    color: "rgba(250,245,234,0.75)",
                    lineHeight: 1.5,
                  }}
                >
                  {item.description}
                </p>
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
