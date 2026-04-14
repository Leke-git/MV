"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (pathname.startsWith("/admin")) return null;

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0,
        height: "var(--nav-height)", zIndex: 100,
        display: "flex", alignItems: "center",
        justifyContent: "space-between", padding: "0 40px",
        // Subtle blur background after scroll
        background: scrolled && !menuOpen
          ? "rgba(10,10,10,0.85)"
          : "transparent",
        backdropFilter: scrolled && !menuOpen ? "blur(12px)" : "none",
        borderBottom: scrolled && !menuOpen
          ? "1px solid rgba(255,255,255,0.06)"
          : "1px solid transparent",
        transition: "background 0.4s ease, border-color 0.4s ease, backdrop-filter 0.4s ease",
      }}>
        {/* Logo */}
        <Link
          href="/"
          style={{
            display: "flex", alignItems: "center",
            mixBlendMode: menuOpen ? "normal" : "normal",
            zIndex: 102,
          }}
        >
          <Image
            src="/assets/images/myke-visuals-logo.png"
            alt="Myke Visuals"
            width={88}
            height={88}
            style={{
              width: "clamp(52px, 6vw, 72px)",
              height: "auto",
              objectFit: "contain",
              // Invert to white on dark nav (logo is white-on-black, so filter to remove black bg)
              filter: menuOpen
                ? "brightness(1)"
                : "brightness(1)",
            }}
            priority
          />
        </Link>

        {/* Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          style={{
            background: "none", border: "none", cursor: "pointer",
            padding: "10px", display: "flex", flexDirection: "column",
            gap: "7px", zIndex: 102,
          }}
        >
          <span style={{
            display: "block", width: "26px", height: "1.5px",
            background: "var(--color-text-primary)",
            transition: "transform 0.35s cubic-bezier(0.4,0,0.2,1), opacity 0.2s",
            transform: menuOpen ? "rotate(45deg) translate(6px, 6px)" : "none",
          }} />
          <span style={{
            display: "block", width: "26px", height: "1.5px",
            background: "var(--color-text-primary)",
            transition: "opacity 0.2s",
            opacity: menuOpen ? 0 : 1,
          }} />
          <span style={{
            display: "block", width: "26px", height: "1.5px",
            background: "var(--color-text-primary)",
            transition: "transform 0.35s cubic-bezier(0.4,0,0.2,1), opacity 0.2s",
            transform: menuOpen ? "rotate(-45deg) translate(6px, -6px)" : "none",
          }} />
        </button>
      </nav>

      {/* Full-screen overlay menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
            style={{
              position: "fixed", inset: 0, zIndex: 99,
              background: "#0a0a0a",
              display: "flex", flexDirection: "column",
              padding: "0 40px",
              overflow: "hidden",
            }}
          >
            {/* Nav links */}
            <div style={{
              flex: 1, display: "flex", flexDirection: "column",
              justifyContent: "center", gap: 0,
              paddingTop: "80px",
            }}>
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 32 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 16 }}
                  transition={{ delay: i * 0.045 + 0.15, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  style={{ overflow: "hidden" }}
                >
                  <Link
                    href={link.href}
                    style={{
                      display: "block",
                      fontFamily: "var(--font-display)",
                      fontSize: "clamp(44px, 7vw, 96px)",
                      fontWeight: 400,
                      letterSpacing: "-0.03em",
                      lineHeight: 1.0,
                      textTransform: "uppercase",
                      color: pathname === link.href
                        ? "var(--color-accent-light)"
                        : "var(--color-text-primary)",
                      paddingBottom: "2px",
                      borderBottom: "1px solid rgba(255,255,255,0.07)",
                      transition: "color 0.2s",
                    }}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Social links bar */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.35 }}
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
                    justifyContent: "center", gap: "6px",
                    padding: "20px 12px",
                    fontFamily: "var(--font-display)", fontSize: "11px",
                    fontWeight: 500, letterSpacing: "0.10em",
                    color: i === socialLinks.length - 1
                      ? "var(--color-accent-light)"
                      : "var(--color-text-primary)",
                    textDecoration: "none",
                    borderRight: i < socialLinks.length - 1
                      ? "1px solid rgba(255,255,255,0.1)"
                      : "none",
                    transition: "color 0.2s",
                  }}
                >
                  {link.label}
                  <span style={{ fontSize: "12px", opacity: 0.6 }}>↗</span>
                </a>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
