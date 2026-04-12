import type { Metadata } from "next";
import Image from "next/image";
import PublicLayout from "@/components/layout/PublicLayout";
import { getReviews } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Reviews",
  description: "Read what clients say about working with Myke Visuals — Abuja's professional photography studio.",
};

export default async function ReviewsPage() {
  const reviews = await getReviews();

  const fallback = [
    { id: "1", reviewer_name: "Michael T.", reviewer_title: "Marketing Manager", reviewer_company: "Stellar Designs", body: "Myke has an incredible ability to make you feel completely at ease in front of the camera. The portraits he delivered were beyond anything we imagined — our whole team was blown away.", rating: 5, approved: true, created_at: "" },
    { id: "2", reviewer_name: "Aurora Jensen", reviewer_title: "Marketing Director", reviewer_company: "", body: "We hired Myke for our brand campaign and the results spoke for themselves. Professional, creative, and deeply committed to getting every shot right. We'll be working with him for every campaign going forward.", rating: 5, approved: true, created_at: "" },
    { id: "3", reviewer_name: "G. Monroe", reviewer_title: "Bride", reviewer_company: "", body: "Our wedding photos are everything. Myke captured moments we didn't even know were happening — we relive the whole day every time we look at them.", rating: 5, approved: true, created_at: "" },
    { id: "4", reviewer_name: "Michael", reviewer_title: "MD", reviewer_company: "Stellar Designs", body: "It was a fantastic experience! They brought a level of professionalism and creativity to our product photography that truly set our brand apart. We look forward to working with them again in the future!", rating: 5, approved: true, created_at: "" },
  ];

  const displayReviews = reviews.length > 0 ? reviews : fallback;

  return (
    <PublicLayout heroPadding>
      <section style={{ background: "var(--color-bg)", padding: "120px 40px 150px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          {/* Header */}
          <div style={{ marginBottom: "80px" }}>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--color-accent)", marginBottom: "16px" }}>TESTIMONIALS</p>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(36px, 7vw, 90px)", fontWeight: 400, letterSpacing: "-0.05em", lineHeight: 0.9, color: "var(--color-text-primary)" }}>
              Smiles and Stories
              <br />
              from My Clients
            </h1>
          </div>

          {/* Reviews grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1px", background: "var(--color-border-subtle)" }}>
            {displayReviews.map((review) => (
              <div key={review.id} style={{ background: "var(--color-bg)", padding: "48px 40px", display: "flex", flexDirection: "column", gap: "32px" }}>
                {/* Stars */}
                <div style={{ display: "flex", gap: "4px" }}>
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <span key={i} style={{ color: "var(--color-accent)", fontSize: "16px" }}>★</span>
                  ))}
                </div>

                {/* Quote */}
                <p style={{ fontFamily: "var(--font-body)", fontSize: "clamp(15px, 1.8vw, 20px)", fontWeight: 300, color: "var(--color-text-primary)", lineHeight: 1.6, letterSpacing: "-0.01em", flex: 1 }}>
                  &ldquo;{review.body}&rdquo;
                </p>

                {/* Author */}
                <div style={{ display: "flex", alignItems: "center", gap: "16px", borderTop: "1px solid var(--color-border-subtle)", paddingTop: "24px" }}>
                  {(review as any).avatar_url ? (
                    <div style={{ width: "44px", height: "44px", borderRadius: "50%", overflow: "hidden", flexShrink: 0, position: "relative" }}>
                      <Image src={(review as any).avatar_url} alt={review.reviewer_name} fill style={{ objectFit: "cover" }} />
                    </div>
                  ) : (
                    <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "var(--color-surface)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontFamily: "var(--font-display)", fontSize: "18px", color: "var(--color-text-muted)" }}>
                        {review.reviewer_name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div>
                    <p style={{ fontFamily: "var(--font-display)", fontSize: "15px", fontWeight: 500, color: "var(--color-text-primary)", letterSpacing: "-0.01em" }}>
                      {review.reviewer_name}
                    </p>
                    {(review.reviewer_title || review.reviewer_company) && (
                      <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--color-text-muted)" }}>
                        {[review.reviewer_title, review.reviewer_company].filter(Boolean).join(", ")}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <style>{`
        @media (max-width: 809px) {
          section > div > div[style*="grid-template-columns: repeat(2"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </PublicLayout>
  );
}
