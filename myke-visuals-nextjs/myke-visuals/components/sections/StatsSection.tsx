"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

const stats = [
  { value: 10, suffix: "K+", label: "Hours Behind the Lens" },
  { value: 5, suffix: "+", label: "Years of Experience" },
  { value: 12, suffix: "+", label: "Awards and Recognitions" },
  { value: 200, suffix: "+", label: "Happy Clients Served" },
];

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1500;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * value));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, value]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

export default function StatsSection() {
  return (
    <section
      style={{
        background: "var(--color-bg)",
        padding: "80px 40px",
        borderBottom: "1px solid var(--color-border-subtle)",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "40px",
        }}
      >
        {stats.map((stat) => (
          <div
            key={stat.label}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              borderLeft: "1px solid var(--color-border-subtle)",
              paddingLeft: "24px",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(36px, 5vw, 60px)",
                fontWeight: 400,
                letterSpacing: "-0.04em",
                lineHeight: 1,
                color: "var(--color-text-primary)",
              }}
            >
              <AnimatedCounter value={stat.value} suffix={stat.suffix} />
            </span>
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "13px",
                color: "var(--color-text-muted)",
                letterSpacing: "0.02em",
                textTransform: "uppercase",
              }}
            >
              {stat.label}
            </span>
          </div>
        ))}
      </div>

      <style>{`
        @media (max-width: 809px) {
          section > div { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </section>
  );
}
