"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        minHeight: "600px",
        background: "var(--color-bg)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Background image */}
      {/* [README] Replace src with Myke's actual hero image */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url('/assets/images/hero-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "contrast(1.1) grayscale(0)",
          zIndex: 0,
        }}
      />

      {/* Dark overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 100%)",
          zIndex: 1,
        }}
      />

      {/* Bottom content */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "130px 40px 50px",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          alignItems: "flex-end",
          gap: "20px",
        }}
      >
        {/* Right-side text block */}
        <div style={{ maxWidth: "400px", textAlign: "right" }}>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "14px",
              fontWeight: 300,
              color: "var(--color-text-primary)",
              lineHeight: 1.6,
              letterSpacing: "0.02em",
              textTransform: "uppercase",
              marginBottom: "20px",
            }}
          >
            HI, I&apos;M MYKE — PROFESSIONAL PHOTOGRAPHER & VISUAL STORYTELLER
            BASED IN ABUJA, NIGERIA. I SHOOT PORTRAITS, WEDDINGS, FASHION &
            BRANDS — EVERY FRAME INTENTIONAL, EVERY IMAGE EARNED.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link
              href="https://wa.me/message/OTYCTLJLVBSWN1"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                fontFamily: "var(--font-display)",
                fontSize: "13px",
                fontWeight: 500,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--color-bg)",
                background: "var(--color-text-primary)",
                padding: "14px 28px",
                transition: "background 0.2s ease",
              }}
            >
              WORK WITH ME
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Large hero title — bottom left */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.1 }}
        style={{
          position: "absolute",
          bottom: "50px",
          left: "40px",
          zIndex: 2,
        }}
      >
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(66px, 13vw, 157px)",
            fontWeight: 400,
            lineHeight: 0.85,
            letterSpacing: "-0.06em",
            color: "var(--color-text-primary)",
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          Capturing
          <br />
          Life&apos;s Best
          <br />
          Moments
        </h1>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        style={{
          position: "absolute",
          bottom: "30px",
          right: "40px",
          zIndex: 2,
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "11px",
            color: "var(--color-text-dim)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          Scroll to Explore
        </span>
      </motion.div>

      {/* Brand watermark */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 1,
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(14px, 2vw, 20px)",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.15)",
          }}
        >
          MYKE VISUALS
        </p>
      </div>

      <style>{`
        @media (max-width: 809px) {
          section > div:nth-child(4) { padding: 100px 12px 120px; }
        }
      `}</style>
    </section>
  );
}
