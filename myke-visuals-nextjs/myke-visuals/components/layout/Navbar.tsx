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

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Don't show public navbar on admin routes
  if (pathname.startsWith("/admin")) return null;

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "var(--nav-height)",
          zIndex: 100,
          mixBlendMode: "exclusion",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 40px",
          transition: "background 0.3s ease",
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center" }}>
          {/* [README] Replace with your actual logo image */}
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "18px",
              fontWeight: 600,
              color: "var(--color-text-primary)",
              letterSpacing: "-0.02em",
            }}
          >
            MYKE VISUALS
          </span>
        </Link>

        {/* Desktop Nav */}
        <div
          className="desktop-nav"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "32px",
          }}
        >
          {navLinks.slice(1, -1).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "13px",
                fontWeight: 500,
                letterSpacing: "0.02em",
                textTransform: "uppercase",
                color:
                  pathname === link.href
                    ? "var(--color-accent)"
                    : "var(--color-text-primary)",
                transition: "color 0.2s ease",
              }}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/contact"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "13px",
              fontWeight: 500,
              letterSpacing: "0.02em",
              textTransform: "uppercase",
              color: "var(--color-bg)",
              background: "var(--color-text-primary)",
              padding: "10px 20px",
              display: "inline-block",
              transition: "opacity 0.2s ease",
            }}
          >
            WORK WITH ME
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="mobile-menu-btn"
          style={{
            display: "none",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "8px",
            flexDirection: "column",
            gap: "6px",
          }}
          aria-label="Toggle menu"
        >
          <span
            style={{
              display: "block",
              width: "24px",
              height: "2px",
              background: "var(--color-text-primary)",
              transition: "transform 0.3s ease",
              transform: menuOpen ? "rotate(45deg) translateY(8px)" : "none",
            }}
          />
          <span
            style={{
              display: "block",
              width: "24px",
              height: "2px",
              background: "var(--color-text-primary)",
              transition: "opacity 0.3s ease",
              opacity: menuOpen ? 0 : 1,
            }}
          />
          <span
            style={{
              display: "block",
              width: "24px",
              height: "2px",
              background: "var(--color-text-primary)",
              transition: "transform 0.3s ease",
              transform: menuOpen ? "rotate(-45deg) translateY(-8px)" : "none",
            }}
          />
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 99,
              background: "var(--color-bg)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "40px",
              padding: "80px 40px 40px",
            }}
          >
            {navLinks.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  href={link.href}
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(32px, 8vw, 60px)",
                    fontWeight: 400,
                    letterSpacing: "-0.03em",
                    color:
                      pathname === link.href
                        ? "var(--color-accent)"
                        : "var(--color-text-primary)",
                    lineHeight: 1,
                  }}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 809px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
        @media (min-width: 810px) {
          .mobile-menu-btn { display: none !important; }
        }
      `}</style>
    </>
  );
}
