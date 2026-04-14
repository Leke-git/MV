"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

const services = [
  {
    title: "Portrait Photography",
    description: "Whether it's a personal brand shoot, corporate headshot, or creative portrait session, Myke brings precision lighting and a calm, collaborative approach that draws out your most powerful self.",
    image: "/assets/images/service-portrait.jpg",
    cardBg: "rgba(10,10,10,0.75)",
    cardColor: "var(--color-text-primary)",
  },
  {
    title: "Wedding Photography",
    description: "Your wedding deserves more than a camera pointed at the altar. Myke documents the full emotional arc of your day — the anticipation, the vows, the celebration — with artistry and discretion.",
    image: "/assets/images/service-wedding.jpg",
    cardBg: "var(--color-accent)",
    cardColor: "#0a0a0a",
  },
  {
    title: "Commercial & Brand Photography",
    description: "Visual identity starts with great photography. Myke works with businesses and brands to produce commercial imagery that communicates quality, builds trust, and converts attention into action.",
    image: "/assets/images/service-commercial.jpg",
    cardBg: "rgba(10,10,10,0.75)",
    cardColor: "var(--color-text-primary)",
  },
  {
    title: "Fashion & Editorial",
    description: "Concept-driven, high-impact imagery for fashion brands, designers, and publications. Myke brings a director's eye to every editorial — images that belong in print and stop the scroll.",
    image: "/assets/images/service-fashion.jpg",
    cardBg: "var(--color-accent)",
    cardColor: "#0a0a0a",
  },
];

export default function ServicesSection() {
  const [active, setActive] = useState(0);
  const [animating, setAnimating] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [pinned, setPinned] = useState(false);
  const [done, setDone] = useState(false);
  const scrollAccum = useRef(0);
  const lastY = useRef(0);

  // Scroll-jacking: pin section, cycle through services on scroll
  useEffect(() => {
    const SCROLL_PER_SLIDE = 180;

    function handleWheel(e: WheelEvent) {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();

      // Activate pinning when section is in view and not done
      if (rect.top <= 0 && rect.bottom > window.innerHeight && !done) {
        e.preventDefault();
        scrollAccum.current += e.deltaY;

        if (scrollAccum.current >= SCROLL_PER_SLIDE && active < services.length - 1) {
          scrollAccum.current = 0;
          goTo(active + 1);
        } else if (scrollAccum.current <= -SCROLL_PER_SLIDE && active > 0) {
          scrollAccum.current = 0;
          goTo(active - 1);
        }

        // Release when last slide reached and scrolling down
        if (active === services.length - 1 && e.deltaY > 0) {
          setDone(true);
        }
      } else if (rect.top > 0) {
        // Reset when scrolled back above
        setDone(false);
        scrollAccum.current = 0;
      }
    }

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [active, done]);

  function goTo(index: number) {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setActive(index);
      setAnimating(false);
    }, 50);
  }

  const service = services[active];

  return (
    <section
      ref={sectionRef}
      style={{
        position: "relative",
        height: `${services.length * 100}vh`,
        background: "var(--color-bg)",
      }}
    >
      {/* Sticky inner container */}
      <div style={{
        position: "sticky", top: 0, height: "100vh",
        overflow: "hidden", display: "flex", flexDirection: "column",
      }}>
        {/* Full-bleed background image */}
        <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          {services.map((s, i) => (
            <div key={i} style={{
              position: "absolute", inset: 0,
              opacity: active === i ? 1 : 0,
              transition: "opacity 0.7s ease",
            }}>
              <Image
                src={s.image} alt={s.title} fill
                style={{ objectFit: "cover" }}
                sizes="100vw" priority={i === 0}
              />
              <div style={{
                position: "absolute", inset: 0,
                background: "rgba(0,0,0,0.45)",
              }} />
            </div>
          ))}
        </div>

        <div style={{
          position: "absolute", top: "40px", left: "50%",
          transform: "translateX(-50%)", zIndex: 2, textAlign: "center",
        }}>
          <h2 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(48px, 8vw, 96px)",
            fontWeight: 400, letterSpacing: "-0.045em", lineHeight: 0.9,
            color: "var(--color-accent-light)",
            whiteSpace: "nowrap",
          }}>
            My Expertise
          </h2>
        </div>

        {/* 3D Cube card — centered */}
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -40%)", zIndex: 3,
          perspective: "1200px",
        }}>
          <div style={{
            width: "clamp(340px, 40vw, 560px)",
            transition: "transform 0.6s cubic-bezier(0.4,0,0.2,1)",
            transform: animating ? "rotateX(-90deg)" : "rotateX(0deg)",
            transformStyle: "preserve-3d",
          }}>
            {/* Card face */}
            {services.map((s, i) => (
              <div key={i} style={{
                display: active === i ? "block" : "none",
                background: s.cardBg,
                backdropFilter: "blur(12px)",
                border: `1px solid ${s.cardBg.includes("accent") ? "transparent" : "rgba(255,255,255,0.12)"}`,
                padding: "40px 48px 48px",
              }}>
                <h3 style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(22px, 2.5vw, 30px)",
                  fontWeight: 400, letterSpacing: "-0.02em",
                  color: s.cardColor, marginBottom: "28px", lineHeight: 1.2,
                }}>
                  {s.title}
                </h3>
                <p style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "clamp(15px, 1.5vw, 17px)",
                  fontWeight: 300, lineHeight: 1.75,
                  color: s.cardBg.includes("accent") ? "rgba(10,10,10,0.8)" : "rgba(250,245,234,0.8)",
                }}>
                  {s.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Dot navigation — right side */}
        <div style={{
          position: "absolute", right: "32px", top: "50%",
          transform: "translateY(-50%)", zIndex: 4,
          display: "flex", flexDirection: "column", gap: "12px", alignItems: "center",
        }}>
          {services.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              style={{
                border: "none", cursor: "pointer", padding: 0,
                background: i === active ? "var(--color-accent)" : "rgba(255,255,255,0.3)",
                width: i === active ? "3px" : "4px",
                height: i === active ? "28px" : "4px",
                borderRadius: i === active ? "2px" : "50%",
                transition: "all 0.3s ease",
              }}
              aria-label={`Service ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
