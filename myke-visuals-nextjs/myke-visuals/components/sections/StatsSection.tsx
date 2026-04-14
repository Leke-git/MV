"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const stats = [
  { value: 10, suffix: "K+", label: "Hours Behind the Lens" },
  { value: 5, suffix: "+", label: "Years of Experience" },
  { value: 15, suffix: "+", label: "Awards and Recognitions" },
  { value: 500, suffix: "+", label: "Happy Clients Served" },
];

function AnimatedCounter({ value, suffix, inView }: { value: number; suffix: string; inView: boolean }) {
  const [count, setCount] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;
    let start = 0;
    const duration = 2000;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * value));
      if (progress < 1) requestAnimationFrame(step);
      else setCount(value);
    };
    requestAnimationFrame(step);
  }, [inView, value]);

  return (
    <span>
      <span style={{ color: "var(--color-text-primary)" }}>{count}</span>
      <span style={{ color: "var(--color-accent)" }}>{suffix}</span>
    </span>
  );
}

export default function StatsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    // Negative margin pulls stats up to overlap the hero image
    // position:relative + zIndex ensures stats sit on top
    <section
      ref={ref}
      style={{
        position: "relative",
        zIndex: 2,
        marginTop: "-2px",
        background: "transparent",
      }}
    >
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
      }}>
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            style={{
              padding: "clamp(32px, 5vw, 60px) clamp(24px, 4vw, 48px)",
              // Semi-transparent dark card — hero image bleeds through
              background: "rgba(10, 10, 10, 0.72)",
              backdropFilter: "blur(0px)",
              borderRight: i % 2 === 0 ? "1px solid rgba(255,255,255,0.08)" : "none",
              borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.08)" : "none",
              display: "flex",
              flexDirection: "column",
              gap: "clamp(12px, 2vw, 20px)",
            }}
          >
            <span style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(13px, 1.4vw, 17px)",
              fontWeight: 300,
              color: "rgba(250,245,234,0.7)",
              letterSpacing: "0.01em",
            }}>
              {stat.label}
            </span>
            <span style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(72px, 10vw, 140px)",
              fontWeight: 400,
              letterSpacing: "-0.045em",
              lineHeight: 1,
            }}>
              <AnimatedCounter value={stat.value} suffix={stat.suffix} inView={inView} />
            </span>
          </motion.div>
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
