"use client";

import Image from "next/image";
import Link from "next/link";

const extras = [
  {
    title: "Studio Hire",
    description: "Book Myke Visuals Studio by the hour — fully equipped with lighting, backdrops, a cyclorama wall, and changing room.",
    image: "/assets/images/studio-hire.jpg",
    href: "/studio",
  },
  {
    title: "Equipment Rental",
    description: "Need gear without the full studio booking? Equipment is available to rent separately.",
    image: "/assets/images/equipment-rental.jpg",
    href: "/studio#equipment",
  },
  {
    title: "Content Creation",
    description: "Social-first visual content for creators, influencers, and brands built for the scroll.",
    image: "/assets/images/content-creation.jpg",
    href: "/contact",
  },
  {
    title: "On-Location Shoots",
    description: "Myke is available for destination and on-location shoots across Nigeria and internationally.",
    image: "/assets/images/on-location.jpg",
    href: "/contact",
  },
];

export default function ExtraServicesSection() {
  return (
    <section style={{
      background: "var(--color-accent)",
      position: "relative", zIndex: 2,
      // Scroll-over effect: this section layers on top of the previous
      marginTop: "-1px",
    }}>
      {/* Heading */}
      <div style={{ padding: "80px 40px 60px" }}>
        <h2 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(52px, 9vw, 120px)",
          fontWeight: 400, letterSpacing: "-0.05em", lineHeight: 0.85,
          color: "#0a0a0a",
        }}>
          Wait…<br />
          There&apos;s more!
        </h2>
      </div>

      {/* Grid */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(2, 1fr)",
        gap: "2px", background: "#0a0a0a",
      }}>
        {extras.map((item) => (
          <Link key={item.title} href={item.href} style={{
            display: "block", position: "relative",
            overflow: "hidden", aspectRatio: "4/3", cursor: "pointer",
          }}>
            <Image
              src={item.image} alt={item.title} fill
              style={{ objectFit: "cover", transition: "transform 0.6s ease" }}
              sizes="(max-width: 809px) 100vw, 50vw"
            />
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.1) 55%)",
              zIndex: 1,
            }} />
            <div style={{
              position: "absolute", bottom: "24px", left: "24px",
              right: "24px", zIndex: 2,
            }}>
              <h3 style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(18px, 2.5vw, 26px)",
                fontWeight: 400, letterSpacing: "-0.02em", lineHeight: 1.2,
                color: "var(--color-text-primary)", marginBottom: "8px",
              }}>
                {item.title}
              </h3>
              <p style={{
                fontFamily: "var(--font-body)", fontSize: "14px",
                fontWeight: 300, color: "rgba(250,245,234,0.75)", lineHeight: 1.5,
              }}>
                {item.description}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <style>{`
        @media (max-width: 809px) {
          section > div:last-child { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
