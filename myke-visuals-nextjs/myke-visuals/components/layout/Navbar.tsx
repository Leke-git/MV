"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

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
  { label: "INSTAGRAM", href: "https://www.instagram.com/mykevisuals/" },
  { label: "BEHANCE", href: "https://www.behance.net/michaelenekwe" },
  { label: "YOUTUBE", href: "https://www.youtube.com/@MykeVisuals" },
  { label: "WHATSAPP", href: "https://wa.me/message/OTYCTLJLVBSWN1" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  if (pathname.startsWith("/admin")) return null;

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0,
        height: "var(--nav-height)", zIndex: 100,
        display: "flex", alignItems: "center",
        justifyContent: "space-between", padding: "0 40px",
        pointerEvents: "none",
      }}>
        {/* Logo */}
        <Link href="/" style={{
          display: "flex", alignItems: "center",
          pointerEvents: "auto", mixBlendMode: "exclusion",
        }}>
          <span style={{
            fontFamily: "var(--font-display)", fontSize: "16px",
            fontWeight: 600, color: "var(--color-text-primary)",
            letterSpacing: "0.05em",
          }}>
            MYKE VISUALS
          </span>
        </Link>

        {/* Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          style={{
            background: "none", border: "none", cursor: "pointer",
            padding: "8px", display: "flex", flexDirection: "column",
            gap: "8px", zIndex: 101, pointerEvents: "auto",
            mixBlendMode: menuOpen ? "normal" : "exclusion",
          }}
        >
          <span style={{
            display: "block", width: "28px", height: "1.5px",
            background: "var(--color-text-primary)",
            transition: "transform 0.35s ease",
            transform: menuOpen ? "rotate(45deg) translateY(6.5px)" : "none",
          }} />
          <span style={{
            display: "block", width: "28px", height: "1.5px",
            background: "var(--color-text-primary)",
            transition: "transform 0.35s ease",
            transform: menuOpen ? "rotate(-45deg) translateY(-6.5px)" : "none",
          }} />
        </button>
      </nav>

      {/* Full-screen overlay menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{
              position: "fixed", inset: 0, zIndex: 99,
              background: "#0a0a0a",
              display: "flex", flexDirection: "column",
              padding: "0 40px 0",
              overflow: "hidden",
            }}
          >
            {/* Nav links — full height, vertically centered */}
            <div style={{
              flex: 1, display: "flex", flexDirection: "column",
              justifyContent: "center", gap: 0,
              paddingTop: "80px",
            }}>
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ delay: i * 0.04, duration: 0.25 }}
                >
                  <Link
                    href={link.href}
                    style={{
                      display: "block",
                      fontFamily: "var(--font-display)",
                      fontSize: "clamp(52px, 7vw, 96px)",
                      fontWeight: 400,
                      letterSpacing: "-0.02em",
                      lineHeight: 1.05,
                      textTransform: "uppercase",
                      color: pathname === link.href
                        ? "var(--color-accent)"
                        : "var(--color-text-primary)",
                      paddingBottom: "4px",
                    }}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Social links — bottom bar with vertical separators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              style={{
                display: "flex", alignItems: "stretch",
                borderTop: "1px solid rgba(255,255,255,0.1)",
                margin: "0 -40px",
              }}
            >
              {socialLinks.map((link, i) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    flex: 1, display: "flex", alignItems: "center",
                    justifyContent: "center", gap: "8px",
                    padding: "20px 16px",
                    fontFamily: "var(--font-display)", fontSize: "12px",
                    fontWeight: 500, letterSpacing: "0.08em",
                    color: i === socialLinks.length - 1
                      ? "var(--color-accent)"
                      : "var(--color-text-primary)",
                    textDecoration: "none",
                    borderRight: i < socialLinks.length - 1
                      ? "1px solid rgba(255,255,255,0.1)"
                      : "none",
                  }}
                >
                  {link.label}
                  <span style={{ fontSize: "14px" }}>↗</span>
                </a>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
