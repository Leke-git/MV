import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Reviews — Admin" };

export default async function AdminReviewsPage() {
  const supabase = await createServerSupabaseClient();
  const { data: reviews } = await supabase
    .from("reviews")
    .select("*")
    .order("created_at", { ascending: false });

  const list = reviews || [];
  const pending = list.filter((r) => !r.approved).length;

  return (
    <div>
      <div style={{ marginBottom: "40px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <h1 style={{ fontFamily: '"Clash Display", sans-serif', fontSize: "32px", fontWeight: 400, letterSpacing: "-0.03em", color: "#faf5ea" }}>Reviews</h1>
          {pending > 0 && <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "14px", color: "#ff7738", marginTop: "4px" }}>{pending} pending approval</p>}
        </div>
      </div>

      {list.length === 0 ? (
        <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "15px", color: "#bababa" }}>No reviews yet.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {list.map((review) => (
            <div key={review.id} style={{ background: "#1a1a1a", border: `1px solid ${review.approved ? "rgba(255,255,255,0.07)" : "rgba(255,119,56,0.2)"}`, borderRadius: "8px", padding: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                <div>
                  <p style={{ fontFamily: '"Clash Display", sans-serif', fontSize: "16px", fontWeight: 500, color: "#faf5ea" }}>{review.reviewer_name}</p>
                  <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "13px", color: "#bababa" }}>
                    {[review.reviewer_title, review.reviewer_company].filter(Boolean).join(", ")}
                  </p>
                </div>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <span style={{ color: "#ff7738", fontSize: "14px" }}>{"★".repeat(review.rating)}</span>
                  <span style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "11px", letterSpacing: "0.05em", textTransform: "uppercase", color: review.approved ? "#4ade80" : "#ff7738", background: review.approved ? "rgba(74,222,128,0.1)" : "rgba(255,119,56,0.1)", padding: "3px 8px", borderRadius: "3px" }}>
                    {review.approved ? "Approved" : "Pending"}
                  </span>
                </div>
              </div>
              <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "15px", fontWeight: 300, color: "#bababa", lineHeight: 1.6, marginBottom: "16px" }}>
                &ldquo;{review.body}&rdquo;
              </p>
              {/* [README] Wire up approve/reject actions via API routes */}
              <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "12px", color: "rgba(255,255,255,0.2)" }}>
                Approve / reject actions — connect to /api/admin/reviews/[id] route
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
