"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";

export default function AboutSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      style={{
        background: "var(--color-bg)",
        padding: "150px 40px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "row",
          gap: "80px",
          alignItems: "flex-start",
        }}
      >
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8 }}
          style={{
            flex: "0 0 auto",
            width: "clamp(280px, 35%, 480px)",
            aspectRatio: "4/5",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* [README] Replace with Myke's actual portrait photo */}
          <Image
            src="/assets/images/myke-portrait.jpg"
            alt="Myke Visuals — Enekwe Uzoma Michael"
            fill
            style={{ objectFit: "cover" }}
            sizes="(max-width: 809px) 100vw, 35vw"
          />
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "32px",
            paddingTop: "20px",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "12px",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "var(--color-accent)",
            }}
          >
            MYKE VISUALS
          </p>

          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(36px, 5vw, 56px)",
              fontWeight: 400,
              letterSpacing: "-0.04em",
              lineHeight: 1,
              color: "var(--color-text-primary)",
            }}
          >
            I am …
          </h2>

          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(16px, 2vw, 20px)",
              fontWeight: 300,
              color: "var(--color-text-primary)",
              lineHeight: 1.6,
              letterSpacing: "-0.01em",
              maxWidth: "600px",
            }}
          >
            a photographer and visual storyteller with over five years of
            professional experience capturing the moments, people, and brands
            that define Abuja&apos;s creative scene. From intimate portraits to
            large-scale commercial campaigns, every shoot I take on carries the
            same obsession — images that don&apos;t just document, but resonate.
            Beyond the lens, I built and run Myke Studios, Abuja&apos;s premium
            creative space for photographers, videographers, creators, and
            brands who need a world-class environment to bring their vision to
            life.
          </p>

          <Link
            href="/about"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              fontFamily: "var(--font-display)",
              fontSize: "13px",
              fontWeight: 500,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--color-text-primary)",
              borderBottom: "1px solid var(--color-border-mid)",
              paddingBottom: "4px",
              width: "fit-content",
              transition: "border-color 0.2s ease",
            }}
          >
            More About Me
          </Link>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 809px) {
          section > div { flex-direction: column !important; gap: 40px !important; }
          section > div > div:first-child { width: 100% !important; }
        }
      `}</style>
    </section>
  );
}
