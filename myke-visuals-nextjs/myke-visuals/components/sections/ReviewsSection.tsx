"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Review } from "@/types";

interface Props {
  reviews: Review[];
}

const fallbackReviews: Review[] = [
  {
    id: "1",
    reviewer_name: "Michael T.",
    reviewer_title: "Marketing Manager",
    reviewer_company: "Stellar Designs",
    body: "Myke has an incredible ability to make you feel completely at ease in front of the camera. The portraits he delivered were beyond anything we imagined — our whole team was blown away.",
    rating: 5,
    approved: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    reviewer_name: "Aurora Jensen",
    reviewer_title: "Marketing Director",
    reviewer_company: "",
    body: "We hired Myke for our brand campaign and the results spoke for themselves. Professional, creative, and deeply committed to getting every shot right. We'll be working with him for every campaign going forward.",
    rating: 5,
    approved: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    reviewer_name: "G. Monroe",
    reviewer_title: "Bride",
    reviewer_company: "",
    body: "Our wedding photos are everything. Myke captured moments we didn't even know were happening — we relive the whole day every time we look at them.",
    rating: 5,
    approved: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "4",
    reviewer_name: "Michael",
    reviewer_title: "MD",
    reviewer_company: "Stellar Designs",
    body: "It was a fantastic experience! They brought a level of professionalism and creativity to our product photography that truly set our brand apart. We look forward to working with them again in the future!",
    rating: 5,
    approved: true,
    created_at: new Date().toISOString(),
  },
];

export default function ReviewsSection({ reviews }: Props) {
  const displayReviews = reviews.length > 0 ? reviews : fallbackReviews;
  const [active, setActive] = useState(0);

  return (
    <section
      style={{
        background: "var(--color-bg)",
        padding: "150px 40px",
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: "60px",
          }}
        >
          <div>
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "12px",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "var(--color-accent)",
                marginBottom: "12px",
              }}
            >
              TESTIMONIALS
            </p>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(32px, 5vw, 56px)",
                fontWeight: 400,
                letterSpacing: "-0.04em",
                lineHeight: 1,
                color: "var(--color-text-primary)",
              }}
            >
              Smiles and Stories
              <br />
              from My Clients
            </h2>
          </div>
          <Link
            href="/reviews"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "13px",
              fontWeight: 500,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              color: "var(--color-text-muted)",
              borderBottom: "1px solid var(--color-border-subtle)",
              paddingBottom: "2px",
              whiteSpace: "nowrap",
            }}
          >
            View All Reviews
          </Link>
        </div>

        {/* Active review */}
        <div
          style={{
            border: "1px solid var(--color-border-subtle)",
            background: "var(--color-surface)",
            padding: "48px",
            marginBottom: "24px",
            position: "relative",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(16px, 2vw, 22px)",
              fontWeight: 300,
              color: "var(--color-text-primary)",
              lineHeight: 1.6,
              letterSpacing: "-0.01em",
              marginBottom: "32px",
            }}
          >
            &ldquo;{displayReviews[active].body}&rdquo;
          </p>

          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {displayReviews[active].avatar_url && (
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  overflow: "hidden",
                  flexShrink: 0,
                  position: "relative",
                }}
              >
                <Image
                  src={displayReviews[active].avatar_url!}
                  alt={displayReviews[active].reviewer_name}
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
            )}
            <div>
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "15px",
                  fontWeight: 500,
                  color: "var(--color-text-primary)",
                  letterSpacing: "-0.01em",
                }}
              >
                {displayReviews[active].reviewer_name}
              </p>
              {(displayReviews[active].reviewer_title ||
                displayReviews[active].reviewer_company) && (
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "13px",
                    color: "var(--color-text-muted)",
                  }}
                >
                  {[
                    displayReviews[active].reviewer_title,
                    displayReviews[active].reviewer_company,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Pagination dots */}
        <div style={{ display: "flex", gap: "8px" }}>
          {displayReviews.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              style={{
                width: i === active ? "24px" : "8px",
                height: "8px",
                background: i === active ? "var(--color-text-primary)" : "var(--color-border-mid)",
                border: "none",
                cursor: "pointer",
                padding: 0,
                transition: "width 0.3s ease, background 0.3s ease",
              }}
              aria-label={`Review ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
