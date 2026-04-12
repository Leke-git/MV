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

export default function ReviewsSection({ reviews }: Props) {
  const displayReviews = reviews.length > 0 ? reviews : fallbackReviews;
  const [active, setActive] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const next = useCallback(() => {
    setActive(a => (a + 1) % displayReviews.length);
  }, [displayReviews.length]);

  const prev = useCallback(() => {
    setActive(a => (a - 1 + displayReviews.length) % displayReviews.length);
  }, [displayReviews.length]);

  // Auto-advance every 5 seconds
  useEffect(() => {
    intervalRef.current = setInterval(next, 5000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [next]);

  // Reset timer on manual navigation
  function goTo(i: number) {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setActive(i);
    intervalRef.current = setInterval(next, 5000);
  }

  const review = displayReviews[active];

  return (
    <section style={{ background: "var(--color-bg)", padding: "150px 40px", overflow: "hidden" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "flex-end", marginBottom: "60px",
        }}>
          <div>
            <p style={{
              fontFamily: "var(--font-mono)", fontSize: "12px",
              letterSpacing: "0.15em", textTransform: "uppercase",
              color: "var(--color-accent)", marginBottom: "12px",
            }}>
              TESTIMONIALS
            </p>
            <h2 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(32px, 5vw, 56px)",
              fontWeight: 400, letterSpacing: "-0.04em", lineHeight: 1,
              color: "var(--color-text-primary)",
            }}>
              Smiles and Stories<br />from My Clients
            </h2>
          </div>
          <Link href="/reviews" style={{
            fontFamily: "var(--font-display)", fontSize: "13px",
            fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase",
            color: "var(--color-text-muted)",
            borderBottom: "1px solid var(--color-border-subtle)", paddingBottom: "2px",
            whiteSpace: "nowrap",
          }}>
            View All Reviews
          </Link>
        </div>

        {/* Card */}
        <div style={{
          border: "1px solid var(--color-border-subtle)",
          background: "var(--color-surface)",
          padding: "48px", marginBottom: "24px",
          position: "relative", minHeight: "200px",
        }}>
          <div key={active} style={{ animation: "fadeSlide 0.4s ease" }}>
            <p style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(16px, 2vw, 22px)",
              fontWeight: 300, color: "var(--color-text-primary)",
              lineHeight: 1.6, letterSpacing: "-0.01em", marginBottom: "32px",
            }}>
              &ldquo;{review.body}&rdquo;
            </p>
            <div>
              <p style={{
                fontFamily: "var(--font-display)", fontSize: "15px",
                fontWeight: 500, color: "var(--color-text-primary)",
                letterSpacing: "-0.01em",
              }}>
                {review.reviewer_name}
              </p>
              {(review.reviewer_title || review.reviewer_company) && (
                <p style={{
                  fontFamily: "var(--font-body)", fontSize: "13px",
                  color: "var(--color-text-muted)", marginTop: "2px",
                }}>
                  {[review.reviewer_title, review.reviewer_company].filter(Boolean).join(", ")}
                </p>
              )}
            </div>
          </div>

          {/* Prev/next arrows */}
          <div style={{
            position: "absolute", bottom: "48px", right: "48px",
            display: "flex", gap: "16px",
          }}>
            <button onClick={prev} style={{
              background: "none", border: "1px solid var(--color-border-mid)",
              color: "var(--color-text-primary)", cursor: "pointer",
              width: "40px", height: "40px", display: "flex",
              alignItems: "center", justifyContent: "center", fontSize: "16px",
            }}>←</button>
            <button onClick={() => goTo((active + 1) % displayReviews.length)} style={{
              background: "none", border: "1px solid var(--color-border-mid)",
              color: "var(--color-text-primary)", cursor: "pointer",
              width: "40px", height: "40px", display: "flex",
              alignItems: "center", justifyContent: "center", fontSize: "16px",
            }}>→</button>
          </div>
        </div>

        {/* Dots */}
        <div style={{ display: "flex", gap: "8px" }}>
          {displayReviews.map((_, i) => (
            <button key={i} onClick={() => goTo(i)} style={{
              width: i === active ? "24px" : "8px", height: "8px",
              background: i === active ? "var(--color-text-primary)" : "var(--color-border-mid)",
              border: "none", cursor: "pointer", padding: 0,
              transition: "width 0.3s ease, background 0.3s ease",
            }} aria-label={`Review ${i + 1}`} />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
