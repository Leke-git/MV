"use client";

import { useState } from "react";
import Link from "next/link";

const faqs = [
  {
    q: "How do I book a session with Myke?",
    a: "DM @myke_visuals on Instagram or use the contact form on this site. Sessions are confirmed once a deposit is received.",
  },
  {
    q: "What are your rates?",
    a: "Portrait sessions start at ₦80,000. Commercial and brand shoots are scoped per project. Wedding packages available on request.",
  },
  {
    q: "Do you travel for shoots?",
    a: "Absolutely. Myke is available for destination shoots across Nigeria and internationally. Travel fees apply depending on location.",
  },
  {
    q: "What's the turnaround time for edited photos?",
    a: "A preview gallery is delivered within 5–7 days. Final edited images within 2–3 weeks depending on project scope.",
  },
  {
    q: "Can I also hire your studio separately?",
    a: "Absolutely. Myke Visuals Studio is available for hourly hire to photographers, videographers, creators, podcasters, and brands — independent of booking Myke as your photographer. Visit the Studio page for details.",
  },
  {
    q: "What's included in a studio hire booking?",
    a: "Every booking includes the cyclorama wall, professional lighting, backdrops, and changing room access. Equipment rental is available as an add-on.",
  },
  {
    q: "Do you offer packages that combine photography and studio hire?",
    a: "Yes — if you want Myke to shoot in the studio, combined packages are available. Get in touch to discuss.",
  },
];

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section
      style={{
        background: "var(--color-bg)",
        padding: "150px 40px",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: "60px" }}>
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(16px, 2vw, 20px)",
              fontWeight: 400,
              letterSpacing: "-0.01em",
              color: "var(--color-text-muted)",
              marginBottom: "8px",
            }}
          >
            FAQ Frenzy:
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
            Everything You Want to Know
          </h2>
        </div>

        {/* FAQ list */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          {faqs.map((faq, i) => (
            <div
              key={i}
              style={{
                borderTop: "1px solid var(--color-border-subtle)",
                cursor: "pointer",
              }}
              onClick={() => setOpen(open === i ? null : i)}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "24px 0",
                  gap: "20px",
                }}
              >
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(16px, 2vw, 22px)",
                    fontWeight: 400,
                    letterSpacing: "-0.01em",
                    lineHeight: 1.3,
                    color: "var(--color-text-primary)",
                    flex: 1,
                  }}
                >
                  {faq.q}
                </h3>
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "20px",
                    color: "var(--color-text-muted)",
                    flexShrink: 0,
                    transition: "transform 0.3s ease",
                    transform: open === i ? "rotate(45deg)" : "none",
                    lineHeight: 1,
                  }}
                >
                  +
                </span>
              </div>

              {/* Answer */}
              <div
                style={{
                  overflow: "hidden",
                  maxHeight: open === i ? "300px" : "0",
                  transition: "max-height 0.4s ease",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "16px",
                    fontWeight: 300,
                    color: "var(--color-text-muted)",
                    lineHeight: 1.7,
                    paddingBottom: "24px",
                    maxWidth: "700px",
                  }}
                >
                  {faq.a}
                </p>
              </div>
            </div>
          ))}

          {/* Last border */}
          <div style={{ borderTop: "1px solid var(--color-border-subtle)" }} />
        </div>

        {/* CTA */}
        <div style={{ marginTop: "60px", textAlign: "center" }}>
          <Link
            href="/contact"
            style={{
              display: "inline-block",
              fontFamily: "var(--font-display)",
              fontSize: "13px",
              fontWeight: 500,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--color-bg)",
              background: "var(--color-text-primary)",
              padding: "16px 40px",
            }}
          >
            Let&apos;s Talk
          </Link>
        </div>
      </div>
    </section>
  );
}
