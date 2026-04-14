"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import type { Review } from "@/types";

interface Props { reviews: Review[]; }

const fallbackReviews: Review[] = [
  { id: "1", reviewer_name: "Michael T.", reviewer_title: "Marketing Manager", reviewer_company: "Stellar Designs", body: "Myke has an incredible ability to make you feel completely at ease in front of the camera. The portraits he delivered were beyond anything we imagined — our whole team was blown away.", rating: 5, approved: true, created_at: new Date().toISOString() },
  { id: "2", reviewer_name: "Aurora Jensen", reviewer_title: "Marketing Director", reviewer_company: "", body: "We hired Myke for our brand campaign and the results spoke for themselves. Professional, creative, and deeply committed to getting every shot right. We'll be working with him for every campaign going forward.", rating: 5, approved: true, created_at: new Date().toISOString() },
  { id: "3", reviewer_name: "G. Monroe", reviewer_title: "Bride", reviewer_company: "", body: "Our wedding photos are everything. Myke captured moments we didn't even know were happening — we relive the whole day every time we look at them.", rating: 5, approved: true, created_at: new Date().toISOString() },
  { id: "4", reviewer_name: "Michael", reviewer_title: "MD", reviewer_company: "Galaxy Interiors", body: "It was a fantastic experience! They brought a level of professionalism and creativity to our product photography that truly set our brand apart. We look forward to working with them again.", rating: 5, approved: true, created_at: new Date().toISOString() },
];

function Stars({ count }: { count: number }) {
  return (
    <div style={{ display: "flex", gap: "4px" }}>
      {[...Array(5)].map((_, i) => (
        <svg key={i} width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M8 1.5L9.7 6.3H14.8L10.8 9.1L12.3 14L8 11L3.7 14L5.2 9.1L1.2 6.3H6.3L8 1.5Z"
            fill={i < count ? "var(--color-accent-light)" : "rgba(255,255,255,0.15)"}
          />
        </svg>
      ))}
    </div>
  );
}

function ReviewerAvatar({ name }: { name: string }) {
  const initials = name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div style={{
      width: "46px", height: "46px", borderRadius: "50%",
      background: "var(--color-accent)",
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0,
    }}>
      <span style={{
        fontFamily: "var(--font-display)",
        fontSize: "15px", fontWeight: 600,
        color: "#0a0a0a", letterSpacing: "0.02em",
      }}>{initials}</span>
    </div>
  );
}

function PhotographerIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 22 22" fill="none" style={{ flexShrink: 0 }}>
      <rect x="2" y="6" width="18" height="13" rx="2" stroke="var(--color-accent-light)" strokeWidth="1.5"/>
      <circle cx="11" cy="12.5" r="3.5" stroke="var(--color-accent-light)" strokeWidth="1.5"/>
      <path d="M8 6L9.5 3h3L14 6" stroke="var(--color-accent-light)" strokeWidth="1.5" strokeLinejoin="round"/>
      <circle cx="16.5" cy="9.5" r="1" fill="var(--color-accent-light)"/>
    </svg>
  );
}

export default function ReviewsSection({ reviews }: Props) {
  const displayReviews = reviews.length > 0 ? reviews : fallbackReviews;
  const [active, setActive] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const next = useCallback(() => {
    setActive(a => (a + 1) % displayReviews.length);
  }, [displayReviews.length]);

  useEffect(() => {
    intervalRef.current = setInterval(next, 5000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [next]);

  function goTo(i: number) {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setActive(i);
    intervalRef.current = setInterval(next, 5000);
  }

  const review = displayReviews[active];

  return (
    <section style={{ background: "var(--color-bg)", padding: "clamp(80px,12vw,150px) 40px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "flex-end", marginBottom: "clamp(40px,6vw,72px)",
        }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
              <PhotographerIcon />
              <p style={{
                fontFamily: "var(--font-mono)", fontSize: "11px",
                letterSpacing: "0.18em", textTransform: "uppercase",
                color: "var(--color-accent-light)",
              }}>
                TESTIMONIALS
              </p>
            </div>
            <h2 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(32px, 5vw, 60px)",
              fontWeight: 400, letterSpacing: "-0.04em", lineHeight: 1,
              color: "var(--color-text-primary)",
            }}>
              Smiles and Stories<br />from My Clients
            </h2>
          </div>
          <Link href="/reviews" style={{
            fontFamily: "var(--font-display)", fontSize: "12px",
            fontWeight: 500, letterSpacing: "0.07em", textTransform: "uppercase",
            color: "var(--color-text-muted)",
            borderBottom: "1px solid var(--color-border-subtle)", paddingBottom: "2px",
            whiteSpace: "nowrap",
          }}>
            View All Reviews
          </Link>
        </div>

        {/* Review card */}
        <div style={{
          border: "1px solid var(--color-border-subtle)",
          background: "rgba(255,255,255,0.03)",
          padding: "clamp(32px,5vw,56px)",
          marginBottom: "28px",
          position: "relative", minHeight: "220px",
        }}>
          {/* Decorative quotation mark */}
          <div style={{
            position: "absolute", top: "16px", right: "40px",
            fontFamily: "var(--font-display)",
            fontSize: "140px", lineHeight: 1,
            color: "rgba(224,92,0,0.10)",
            userSelect: "none", pointerEvents: "none",
          }}>"</div>

          <div key={active} style={{ animation: "fadeSlide 0.4s ease" }}>
            <div style={{ marginBottom: "22px" }}>
              <Stars count={review.rating || 5} />
            </div>

            <p style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(17px, 2.2vw, 24px)",
              fontWeight: 300, color: "var(--color-text-primary)",
              lineHeight: 1.6, letterSpacing: "-0.01em",
              marginBottom: "36px", maxWidth: "800px",
            }}>
              &ldquo;{review.body}&rdquo;
            </p>

            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <ReviewerAvatar name={review.reviewer_name} />
              <div>
                <p style={{
                  fontFamily: "var(--font-display)", fontSize: "16px",
                  fontWeight: 500, color: "var(--color-text-primary)",
                  letterSpacing: "-0.01em",
                }}>
                  {review.reviewer_name}
                </p>
                {(review.reviewer_title || review.reviewer_company) && (
                  <p style={{
                    fontFamily: "var(--font-body)", fontSize: "12px",
                    color: "var(--color-text-muted)", marginTop: "2px",
                  }}>
                    {[review.reviewer_title, review.reviewer_company].filter(Boolean).join(", ")}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Nav arrows */}
          <div style={{
            position: "absolute",
            bottom: "clamp(24px,4vw,48px)", right: "clamp(24px,4vw,48px)",
            display: "flex", gap: "12px",
          }}>
            <button onClick={() => goTo((active - 1 + displayReviews.length) % displayReviews.length)} style={{
              background: "none", border: "1px solid var(--color-border-mid)",
              color: "var(--color-text-primary)", cursor: "pointer",
              width: "44px", height: "44px", display: "flex",
              alignItems: "center", justifyContent: "center", fontSize: "16px",
            }}>←</button>
            <button onClick={() => goTo((active + 1) % displayReviews.length)} style={{
              background: "none", border: "1px solid var(--color-border-mid)",
              color: "var(--color-text-primary)", cursor: "pointer",
              width: "44px", height: "44px", display: "flex",
              alignItems: "center", justifyContent: "center", fontSize: "16px",
            }}>→</button>
          </div>
        </div>

        {/* Dots + counter */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            {displayReviews.map((_, i) => (
              <button key={i} onClick={() => goTo(i)} style={{
                width: i === active ? "28px" : "8px",
                height: "8px",
                background: i === active ? "var(--color-accent-light)" : "var(--color-border-mid)",
                border: "none", cursor: "pointer", padding: 0,
                transition: "width 0.3s ease, background 0.3s ease",
                borderRadius: "4px",
              }} aria-label={`Review ${i + 1}`} />
            ))}
          </div>
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: "11px",
            letterSpacing: "0.1em", color: "var(--color-text-dim)",
          }}>
            {String(active + 1).padStart(2, "0")} / {String(displayReviews.length).padStart(2, "0")}
          </span>
        </div>
      </div>

      <style>{`
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
