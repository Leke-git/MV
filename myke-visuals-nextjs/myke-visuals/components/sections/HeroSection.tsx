"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";

export default function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.6], [1, 1.08]);

  return (
    <section ref={ref} style={{
      position: "relative", width: "100%", height: "100vh",
      minHeight: "600px", background: "var(--color-bg)",
      overflow: "hidden", display: "flex", flexDirection: "column",
    }}>
      {/* Background image — fades + scales on scroll */}
      <motion.div style={{
        position: "absolute", inset: 0,
        backgroundImage: "url('/assets/images/hero-bg.jpg')",
        backgroundSize: "cover", backgroundPosition: "center top",
        zIndex: 0, opacity, scale,
        transformOrigin: "center center",
      }} />

      {/* Dark overlay */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.45) 60%, rgba(0,0,0,0.65) 100%)",
        zIndex: 1,
      }} />

      {/* Top-right text block */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.4 }}
        style={{
          position: "absolute", top: "50%", right: "40px",
          transform: "translateY(-80%)",
          maxWidth: "360px", textAlign: "right", zIndex: 2,
        }}
      >
        <p style={{
          fontFamily: "var(--font-body)", fontSize: "13px",
          fontWeight: 300, color: "var(--color-text-primary)",
          lineHeight: 1.7, letterSpacing: "0.03em",
          textTransform: "uppercase", marginBottom: "24px",
        }}>
          HI, I&apos;M MYKE — PROFESSIONAL PHOTOGRAPHER & VISUAL STORYTELLER
          BASED IN ABUJA, NIGERIA. I SHOOT PORTRAITS, WEDDINGS, FASHION &
          BRANDS — EVERY FRAME INTENTIONAL, EVERY IMAGE EARNED.
        </p>
        <Link
          href="https://wa.me/message/OTYCTLJLVBSWN1"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex", alignItems: "center", gap: "12px",
            fontFamily: "var(--font-display)", fontSize: "12px",
            fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase",
            color: "var(--color-bg)", background: "var(--color-text-primary)",
            padding: "14px 24px", border: "1px solid var(--color-text-primary)",
          }}
        >
          WORK WITH ME
          <span style={{ fontSize: "16px", lineHeight: 1 }}>→</span>
        </Link>
      </motion.div>

      {/* Bottom-left headline */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.1 }}
        style={{
          position: "absolute", bottom: "60px", left: "40px", zIndex: 2,
        }}
      >
        <h1 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(72px, 11vw, 148px)",
          fontWeight: 400, lineHeight: 0.88,
          letterSpacing: "-0.05em",
          color: "var(--color-text-primary)",
          pointerEvents: "none", userSelect: "none",
        }}>
          Capturing<br />Life&apos;s Best<br />Moments
        </h1>
      </motion.div>

      {/* Bottom bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0 }}
        style={{
          position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 2,
        }}
      >
        <div style={{ borderTop: "1px solid rgba(250,245,234,0.25)" }} />
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "14px 40px",
        }}>
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: "11px",
            letterSpacing: "0.12em", textTransform: "uppercase",
            color: "rgba(250,245,234,0.5)",
          }}>
            MYKE VISUALS
          </span>
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: "11px",
            letterSpacing: "0.1em", textTransform: "uppercase",
            color: "rgba(250,245,234,0.5)",
          }}>
            ↓ SCROLL TO EXPLORE
          </span>
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: "11px",
            letterSpacing: "0.12em", textTransform: "uppercase",
            color: "rgba(250,245,234,0.5)",
          }}>
            WORK WITH ME
          </span>
        </div>
      </motion.div>

      <style>{`
        @media (max-width: 809px) {
          .hero-text-block {
            top: auto !important; bottom: 200px !important;
            right: 20px !important; left: 20px !important;
            transform: none !important; text-align: left !important;
          }
        }
      `}</style>
    </section>
  );
}
