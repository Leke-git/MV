"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

const stats = [
  { value: 10, suffix: "K+", label: "Hours Behind the Lens" },
  { value: 5, suffix: "+", label: "Years of Experience" },
  { value: 15, suffix: "+", label: "Awards and Recognitions" },
  { value: 500, suffix: "+", label: "Happy Clients Served" },
];

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1800;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * value));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, value]);

  return <span ref={ref}>{count}{suffix}</span>;
}

export default function StatsSection() {
  return (
    <section style={{
      background: "var(--color-bg)",
      padding: "0 0 0",
      position: "relative",
      zIndex: 1,
    }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        borderTop: "1px solid var(--color-border-subtle)",
      }}>
        {stats.map((stat, i) => (
          <div key={stat.label} style={{
            padding: "60px 48px",
            borderRight: i % 2 === 0 ? "1px solid var(--color-border-subtle)" : "none",
            borderBottom: i < 2 ? "1px solid var(--color-border-subtle)" : "none",
            display: "flex", flexDirection: "column", gap: "16px",
          }}>
            <span style={{
              fontFamily: "var(--font-body)", fontSize: "14px",
              fontWeight: 300, color: "var(--color-text-muted)",
              letterSpacing: "0.02em",
            }}>
              {stat.label}
            </span>
            <span style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(56px, 7vw, 96px)",
              fontWeight: 400, letterSpacing: "-0.04em", lineHeight: 1,
              color: "var(--color-text-primary)",
            }}>
              <span style={{ color: "var(--color-text-primary)" }}>
                {stat.value}
              </span>
              <span style={{ color: "var(--color-accent)" }}>
                {stat.suffix}
              </span>
            </span>
          </div>
        ))}
      </div>

      <style>{`
        @media (max-width: 600px) {
          section > div { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
