"use client";

import Link from "next/link";
import Image from "next/image";
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
      {/* ── Orange CTA band ── */}
      <div style={{
        background: "var(--color-accent)",
        padding: "clamp(60px,8vw,100px) 40px",
        position: "relative",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        gap: "36px", minHeight: "400px",
        overflow: "hidden",
      }}>
        {/* Corner brackets — bottom corners only */}
        {[
          { bottom: "28px", left: "28px", isLeft: true },
          { bottom: "28px", right: "28px", isLeft: false },
        ].map((pos, i) => (
          <div key={i} style={{ position: "absolute", width: "24px", height: "24px", ...{ bottom: pos.bottom, left: (pos as {left?: string}).left, right: (pos as {right?: string}).right } }}>
            <div style={{ position: "absolute", background: "#0a0a0a", bottom: 0, [pos.isLeft ? "left" : "right"]: 0, width: "2px", height: "100%" }} />
            <div style={{ position: "absolute", background: "#0a0a0a", bottom: 0, [pos.isLeft ? "left" : "right"]: 0, width: "100%", height: "2px" }} />
          </div>
        ))}

        {/* Aperture / Let's Talk button */}
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
          fontSize: "clamp(18px, 3vw, 30px)",
          fontWeight: 400, letterSpacing: "-0.025em",
          color: "#0a0a0a", textDecoration: "none",
        }}>
          info@mykevisuals.com
        </a>

        {/* Social links */}
        <div style={{ display: "flex", gap: "clamp(24px,4vw,48px)", alignItems: "center" }}>
          {socialLinks.map(link => (
            <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer"
              style={{
                fontFamily: "var(--font-body)", fontSize: "14px",
                color: "#0a0a0a", textDecoration: "none",
                display: "flex", alignItems: "center", gap: "6px",
                letterSpacing: "0.02em", fontWeight: 500,
              }}>
              <span style={{ fontSize: "16px" }}>{link.icon}</span>
              {link.label}
            </a>
          ))}
        </div>
      </div>

      {/* ── Dark footer bottom ── */}
      <div style={{ background: "var(--color-bg)", padding: "40px 40px 0" }}>

        {/* Logo + nav row */}
        <div style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "center", paddingBottom: "32px",
          borderBottom: "1px solid var(--color-border-subtle)",
          flexWrap: "wrap", gap: "24px",
        }}>
          {/* Logo */}
          <Link href="/" style={{ display: "flex", alignItems: "center" }}>
            <Image
              src="/assets/images/myke-visuals-logo.png"
              alt="Myke Visuals"
              width={72}
              height={72}
              style={{ width: "clamp(44px,5vw,60px)", height: "auto", objectFit: "contain" }}
            />
          </Link>

          {/* Nav links */}
          <div style={{
            display: "flex", gap: "clamp(12px,2.5vw,36px)", flexWrap: "wrap",
            justifyContent: "center",
          }}>
            {navLinks.map(link => (
              <Link key={link.href} href={link.href} style={{
                fontFamily: "var(--font-body)", fontSize: "13px",
                color: pathname === link.href ? "var(--color-accent-light)" : "var(--color-text-muted)",
                textDecoration: "none", letterSpacing: "0.01em",
                transition: "color 0.2s ease",
              }}>
                {link.label}
              </Link>
            ))}
          </div>

          {/* Copyright */}
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: "10px",
            letterSpacing: "0.08em", color: "var(--color-text-dim)",
            textTransform: "uppercase",
          }}>
            © {new Date().getFullYear()} Myke Visuals
          </span>
        </div>

        {/* Marquee — Framer FooterText: 240px / 1.0 */}
        <div style={{ overflow: "hidden", paddingTop: "0" }}>
          <div className="marquee-track">
            {[...Array(8)].map((_, i) => (
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

        /* Framer FooterText spec: 240px / 1.0 line-height */
        .marquee-track {
          display: flex;
          gap: 0;
          animation: marquee 22s linear infinite;
          white-space: nowrap;
          width: max-content;
        }
        .marquee-item {
          font-family: var(--font-display);
          font-size: clamp(80px, 16vw, 240px);
          font-weight: 400;
          letter-spacing: -0.05em;
          color: var(--color-text-primary);
          padding: 0 clamp(24px,4vw,64px);
          line-height: 1.0;
          opacity: 0.07;
        }
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @media (max-width: 600px) {
          .marquee-item { font-size: 56px; padding: 0 20px; }
        }
      `}</style>
    </footer>
  );
}
