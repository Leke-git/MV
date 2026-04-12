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
      }}>
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", zIndex: 101 }}>
          {/* [README] Replace with actual logo image: <Image src="/assets/images/logo.png" alt="Myke Visuals" width={80} height={40} /> */}
          <span style={{
            fontFamily: "var(--font-display)", fontSize: "16px",
            fontWeight: 600, color: "var(--color-text-primary)",
            letterSpacing: "0.05em", mixBlendMode: "exclusion",
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
            gap: "7px", zIndex: 101, mixBlendMode: "exclusion",
          }}
        >
          <span style={{
            display: "block", width: "28px", height: "1.5px",
            background: "var(--color-text-primary)",
            transition: "transform 0.4s ease, opacity 0.3s ease",
            transform: menuOpen ? "rotate(45deg) translateY(6px)" : "none",
          }} />
          <span style={{
            display: "block", width: "28px", height: "1.5px",
            background: "var(--color-text-primary)",
            transition: "transform 0.4s ease, opacity 0.3s ease",
            transform: menuOpen ? "rotate(-45deg) translateY(-2px)" : "none",
          }} />
        </button>
      </nav>

      {/* Full-screen menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: "fixed", inset: 0, zIndex: 99,
              background: "var(--color-bg)",
              display: "flex", flexDirection: "column",
              padding: "140px 40px 60px",
            }}
          >
            {/* Nav links */}
            <div style={{ flex: 1 }}>
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                  style={{ borderTop: "1px solid var(--color-border-subtle)" }}
                >
                  <Link
                    href={link.href}
                    style={{
                      display: "block", padding: "20px 0",
                      fontFamily: "var(--font-display)",
                      fontSize: "clamp(28px, 6vw, 56px)",
                      fontWeight: 400, letterSpacing: "-0.03em",
                      color: pathname === link.href ? "var(--color-accent)" : "var(--color-text-primary)",
                      lineHeight: 1,
                    }}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <div style={{ borderTop: "1px solid var(--color-border-subtle)" }} />
            </div>

            {/* Social links bottom */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              style={{ display: "flex", gap: "32px", paddingTop: "40px" }}
            >
              {["Instagram", "Behance", "Youtube", "Whatsapp"].map(s => (
                <span key={s} style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--color-text-muted)", letterSpacing: "0.05em" }}>{s}</span>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
