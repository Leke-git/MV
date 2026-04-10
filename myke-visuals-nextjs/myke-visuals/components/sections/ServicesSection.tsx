"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

const services = [
  {
    title: "Commercial & Brand Photography",
    description:
      "Visual identity starts with great photography. Myke works with businesses and brands to produce commercial imagery that communicates quality, builds trust, and converts attention into action.",
    image: "/assets/images/service-commercial.jpg",
  },
  {
    title: "Fashion & Editorial",
    description:
      "Concept-driven, high-impact imagery for fashion brands, designers, and publications. Myke brings a director's eye to every editorial — images that belong in print and stop the scroll.",
    image: "/assets/images/service-fashion.jpg",
  },
  {
    title: "Wedding Photography",
    description:
      "Your wedding deserves more than a camera pointed at the altar. Myke documents the full emotional arc of your day — the anticipation, the vows, the celebration — with artistry and discretion.",
    image: "/assets/images/service-wedding.jpg",
  },
  {
    title: "Portrait Photography",
    description:
      "Whether it's a personal brand shoot, corporate headshot, or creative portrait session, Myke brings precision lighting and a calm, collaborative approach that draws out your most powerful self.",
    image: "/assets/images/service-portrait.jpg",
  },
];

export default function ServicesSection() {
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
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: "80px" }}
        >
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "12px",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "var(--color-accent)",
              marginBottom: "16px",
            }}
          >
            WHAT I DO
          </p>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(36px, 5vw, 60px)",
              fontWeight: 400,
              letterSpacing: "-0.04em",
              lineHeight: 1,
              color: "var(--color-text-primary)",
            }}
          >
            My Expertise
          </h2>
        </motion.div>

        {/* Services list */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              style={{
                display: "flex",
                flexDirection: i % 2 === 0 ? "row" : "row-reverse",
                gap: "60px",
                alignItems: "center",
                padding: "60px 0",
                borderTop: "1px solid var(--color-border-subtle)",
              }}
            >
              {/* Image */}
              <div
                style={{
                  flex: "0 0 auto",
                  width: "clamp(200px, 30%, 360px)",
                  aspectRatio: "4/5",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* [README] Replace images with Myke's actual service photos */}
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 809px) 100vw, 30vw"
                />
              </div>

              {/* Text */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "20px" }}>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "12px",
                    color: "var(--color-text-muted)",
                    letterSpacing: "0.1em",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(24px, 3vw, 36px)",
                    fontWeight: 400,
                    letterSpacing: "-0.02em",
                    lineHeight: 1.2,
                    color: "var(--color-text-primary)",
                  }}
                >
                  {service.title}
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "16px",
                    fontWeight: 300,
                    color: "var(--color-text-muted)",
                    lineHeight: 1.7,
                    maxWidth: "480px",
                  }}
                >
                  {service.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 809px) {
          section > div > div > div {
            flex-direction: column !important;
            gap: 24px !important;
          }
          section > div > div > div > div:first-child {
            width: 100% !important;
          }
        }
      `}</style>
    </section>
  );
}
