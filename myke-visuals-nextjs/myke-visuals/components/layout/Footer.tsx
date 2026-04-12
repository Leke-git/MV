"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Works", href: "/albums" },
  { label: "Studio", href: "/studio" },
  { label: "Reviews", href: "/reviews" },
  { label: "Blogs", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

const socialLinks = [
  { label: "Instagram", href: "https://www.instagram.com/mykevisuals/", icon: "◎" },
  { label: "Behance", href: "https://www.behance.net/michaelenekwe", icon: "Bē" },
  { label: "Youtube", href: "https://www.youtube.com/@MykeVisuals", icon: "▷" },
  { label: "Whatsapp", href: "https://wa.me/message/OTYCTLJLVBSWN1", icon: "◉" },
];

export default function Footer() {
  const pathname = usePathname();

  return (
    <footer>
      {/* Orange CTA section */}
      <div style={{
        background: "var(--color-accent)",
        padding: "80px 40px",
        position: "relative",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        gap: "40px", minHeight: "420px",
        overflow: "hidden",
      }}>
        {/* Corner brackets */}
        {[
          { bottom: "28px", left: "28px" },
          { bottom: "28px", right: "28px" },
        ].map((pos, i) => (
          <div key={i} style={{ position: "absolute", width: "24px", height: "24px", ...pos }}>
            <div style={{
              position: "absolute", background: "#0a0a0a",
              ...(i === 0
                ? { bottom: 0, left: 0, width: "2px", height: "100%" }
                : { bottom: 0, right: 0, width: "2px", height: "100%" })
            }} />
            <div style={{
              position: "absolute", background: "#0a0a0a",
              bottom: 0, left: i === 0 ? 0 : undefined, right: i === 1 ? 0 : undefined,
              width: "100%", height: "2px",
            }} />
          </div>
        ))}

        {/* Animated aperture link */}
        <Link href="/contact" style={{ textDecoration: "none", display: "inline-block" }}>
          <div className="footer-aperture">
            <svg viewBox="0 0 120 120" width="160" height="160">
              <circle cx="60" cy="60" r="58" fill="#0a0a0a" />
              {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                <g key={i} transform={`rotate(${angle} 60 60)`}>
                  <ellipse cx="60" cy="30" rx="14" ry="26" fill="var(--color-text-primary)" className="footer-blade" />
                </g>
              ))}
              <polygon points="60,38 74,46 74,62 60,70 46,62 46,46" fill="#0a0a0a" />
              <text x="60" y="57" textAnchor="middle" fontFamily="var(--font-display)" fontSize="9" fill="var(--color-text-primary)" letterSpacing="0.5" fontWeight="500">LET&apos;S</text>
              <text x="60" y="68" textAnchor="middle" fontFamily="var(--font-display)" fontSize="9" fill="var(--color-text-primary)" letterSpacing="0.5" fontWeight="500">TALK</text>
            </svg>
          </div>
        </Link>

        {/* Email */}
        <a href="mailto:info@mykevisuals.com" style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(18px, 3vw, 28px)",
          fontWeight: 400, letterSpacing: "-0.02em",
          color: "#0a0a0a", textDecoration: "none",
        }}>
          info@mykevisuals.com
        </a>

        {/* Social links */}
        <div style={{ display: "flex", gap: "40px", alignItems: "center" }}>
          {socialLinks.map(link => (
            <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer"
              style={{
                fontFamily: "var(--font-body)", fontSize: "14px",
                color: "#0a0a0a", textDecoration: "none",
                display: "flex", alignItems: "center", gap: "6px",
                letterSpacing: "0.02em",
              }}>
              <span style={{ fontSize: "16px" }}>{link.icon}</span>
              {link.label}
            </a>
          ))}
        </div>
      </div>

      {/* Black footer bottom */}
      <div style={{
        background: "var(--color-bg)",
        padding: "40px 40px 0",
      }}>
        {/* Nav links centered */}
        <div style={{
          display: "flex", justifyContent: "center",
          gap: "clamp(16px, 3vw, 48px)", flexWrap: "wrap",
          paddingBottom: "32px",
          borderBottom: "1px solid var(--color-border-subtle)",
        }}>
          {navLinks.map(link => (
            <Link key={link.href} href={link.href} style={{
              fontFamily: "var(--font-body)", fontSize: "14px",
              color: pathname === link.href ? "var(--color-accent)" : "var(--color-text-muted)",
              textDecoration: "none", letterSpacing: "0.01em",
              transition: "color 0.2s ease",
            }}>
              {link.label}
            </Link>
          ))}
        </div>

        {/* Marquee */}
        <div style={{
          overflow: "hidden", padding: "24px 0 0",
          borderTop: "none",
        }}>
          <div className="marquee-track">
            {[...Array(6)].map((_, i) => (
              <span key={i} className="marquee-item">
                MYKE VISUALS
              </span>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .footer-aperture {
          transition: transform 0.5s ease;
          display: inline-block;
        }
        .footer-aperture:hover {
          transform: rotate(60deg);
        }
        .footer-blade {
          transition: transform 0.5s ease;
        }

        .marquee-track {
          display: flex;
          gap: 0;
          animation: marquee 18s linear infinite;
          white-space: nowrap;
          width: max-content;
        }
        .marquee-item {
          font-family: var(--font-display);
          font-size: clamp(48px, 8vw, 120px);
          font-weight: 400;
          letter-spacing: -0.04em;
          color: var(--color-text-primary);
          padding: 0 48px;
          line-height: 1;
          opacity: 0.12;
        }
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @media (max-width: 600px) {
          .marquee-item { font-size: 40px; padding: 0 24px; }
        }
      `}</style>
    </footer>
  );
}
