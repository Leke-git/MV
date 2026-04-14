"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";

export default function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  // Hero image fades out as stats scroll over it
  const imageOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  // Bottom bar fades out early
  const bottomOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  return (
    <section ref={ref} style={{
      position: "relative",
      width: "100%",
      height: "100vh",
      minHeight: "600px",
      background: "var(--color-bg)",
      overflow: "hidden",
    }}>
      {/* Background image — fixed, fades out as stats scroll over */}
      <motion.div style={{
        position: "absolute", inset: 0,
        backgroundImage: "url('/assets/images/hero-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center center",
        zIndex: 0,
        opacity: imageOpacity,
      }} />

      {/* Overlay gradient */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.25) 50%, rgba(0,0,0,0.5) 100%)",
        zIndex: 1,
      }} />

      {/* Top-right: intro text + CTA — upper third */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.5 }}
        style={{
          position: "absolute",
          top: "clamp(100px, 18vh, 200px)",
          right: "40px",
          maxWidth: "340px",
          textAlign: "right",
          zIndex: 2,
        }}
      >
        <p style={{
          fontFamily: "var(--font-body)",
          fontSize: "12px",
          fontWeight: 300,
          color: "var(--color-text-primary)",
          lineHeight: 1.75,
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          marginBottom: "24px",
        }}>
          HI, I&apos;M MYKE — PROFESSIONAL PHOTOGRAPHER & VISUAL STORYTELLER
          BASED IN ABUJA, NIGERIA. I SHOOT PORTRAITS, WEDDINGS, FASHION &
          BRANDS — EVERY FRAME INTENTIONAL, EVERY IMAGE EARNED.
        </p>

        {/* Split outlined CTA */}
        <Link
          href="https://wa.me/message/OTYCTLJLVBSWN1"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex", alignItems: "stretch",
            fontFamily: "var(--font-display)", fontSize: "11px",
            fontWeight: 500, letterSpacing: "0.1em",
            textTransform: "uppercase", textDecoration: "none",
            border: "1px solid var(--color-text-primary)",
          }}
        >
          <span style={{ padding: "13px 20px", color: "var(--color-text-primary)", display: "flex", alignItems: "center" }}>
            WORK WITH ME
          </span>
          <span style={{
            padding: "13px 14px",
            borderLeft: "1px solid var(--color-text-primary)",
            color: "var(--color-text-primary)",
            display: "flex", alignItems: "center", fontSize: "15px",
          }}>→</span>
        </Link>
      </motion.div>

      {/* Bottom-left: headline — anchored higher so it doesn't get cut */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.1 }}
        style={{
          position: "absolute",
          bottom: "clamp(60px, 10vh, 120px)",
          left: "40px",
          zIndex: 2,
        }}
      >
        <h1 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(52px, 10.5vw, 157px)",
          fontWeight: 400,
          lineHeight: 0.80,
          letterSpacing: "-0.055em",
          color: "var(--color-text-primary)",
          pointerEvents: "none",
          userSelect: "none",
        }}>
          Capturing Life&apos;s Best<br />Moments
        </h1>
      </motion.div>

      {/* Bottom bar — fades out on scroll */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0 }}
        style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          zIndex: 2, opacity: bottomOpacity,
        }}
      >
        <div style={{ borderTop: "1px solid rgba(250,245,234,0.2)" }} />
        <div style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "center", padding: "12px 40px",
        }}>
          {["MYKE VISUALS", "↓ SCROLL TO EXPLORE", "WORK WITH ME"].map(label => (
            <span key={label} style={{
              fontFamily: "var(--font-mono)", fontSize: "10px",
              letterSpacing: "0.12em", textTransform: "uppercase",
              color: "rgba(250,245,234,0.4)",
            }}>
              {label}
            </span>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
