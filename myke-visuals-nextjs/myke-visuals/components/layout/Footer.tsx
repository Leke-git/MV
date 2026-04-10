import Link from "next/link";

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
  { label: "Instagram", href: "https://www.instagram.com/mykevisuals/" },
  { label: "Behance", href: "https://www.behance.net/michaelenekwe" },
  { label: "Youtube", href: "https://www.youtube.com/@MykeVisuals" },
  { label: "Whatsapp", href: "https://wa.me/message/OTYCTLJLVBSWN1" },
];

export default function Footer() {
  return (
    <footer
      style={{
        background: "var(--color-bg)",
        borderTop: "1px solid var(--color-border-subtle)",
        padding: "60px 40px 40px",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Top Row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "40px",
            marginBottom: "60px",
            flexWrap: "wrap",
          }}
        >
          {/* Brand */}
          <div style={{ maxWidth: "300px" }}>
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "13px",
                fontWeight: 500,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--color-text-muted)",
                marginBottom: "16px",
              }}
            >
              MYKE VISUALS
            </p>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "14px",
                color: "var(--color-text-muted)",
                lineHeight: 1.6,
              }}
            >
              Professional photographer & visual storyteller based in Abuja, Nigeria.
            </p>
            <Link
              href="/contact"
              style={{
                display: "inline-block",
                marginTop: "20px",
                fontFamily: "var(--font-display)",
                fontSize: "13px",
                fontWeight: 500,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                color: "var(--color-text-primary)",
                borderBottom: "1px solid var(--color-accent)",
                paddingBottom: "2px",
              }}
            >
              Let&apos;s Talk
            </Link>
          </div>

          {/* Nav Links */}
          <div>
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "11px",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--color-text-muted)",
                marginBottom: "16px",
              }}
            >
              Navigation
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "14px",
                    color: "var(--color-text-muted)",
                    transition: "color 0.2s ease",
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Social + Contact */}
          <div>
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "11px",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--color-text-muted)",
                marginBottom: "16px",
              }}
            >
              Connect
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "14px",
                    color: "var(--color-text-muted)",
                    transition: "color 0.2s ease",
                  }}
                >
                  {link.label}
                </a>
              ))}
              <a
                href="mailto:info@mykevisuals.com"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "14px",
                  color: "var(--color-text-muted)",
                  marginTop: "8px",
                }}
              >
                {/* [README] Update with Myke's actual email */}
                info@mykevisuals.com
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div
          style={{
            borderTop: "1px solid var(--color-border-subtle)",
            paddingTop: "24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "16px",
            flexWrap: "wrap",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "12px",
              color: "var(--color-text-muted)",
            }}
          >
            © {new Date().getFullYear()} Myke Visuals. All rights reserved.
          </p>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "12px",
              color: "var(--color-text-muted)",
            }}
          >
            Abuja, Nigeria
          </p>
        </div>
      </div>
    </footer>
  );
}
