"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface Review {
  id: string;
  reviewer_name: string;
  reviewer_title: string | null;
  reviewer_company: string | null;
  body: string;
  rating: number;
  approved: boolean;
  session_id: string | null;
  source: string | null;
  created_at: string;
}

function StarDisplay({ rating }: { rating: number }) {
  return (
    <span style={{ color: "#ff7738", fontSize: "14px", letterSpacing: "2px" }}>
      {"★".repeat(rating)}{"☆".repeat(5 - rating)}
    </span>
  );
}

function ManualAddModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const supabase = createClient();
  const [form, setForm] = useState({ reviewer_name: "", reviewer_title: "", reviewer_company: "", body: "", rating: 5 });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSave() {
    if (!form.reviewer_name || !form.body) { setError("Name and review text are required."); return; }
    setSaving(true);
    const { error } = await supabase.from("reviews").insert({ ...form, approved: true, source: "manual" });
    if (error) { setError(error.message); setSaving(false); }
    else { onSaved(); onClose(); }
  }

  const inputStyle: React.CSSProperties = { width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#faf5ea", fontFamily: '"Satoshi", sans-serif', fontSize: "14px", padding: "12px 14px", outline: "none" };
  const labelStyle: React.CSSProperties = { fontFamily: '"Clash Display", sans-serif', fontSize: "11px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#bababa", display: "block", marginBottom: "6px" };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "32px", width: "100%", maxWidth: "520px", maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
          <h2 style={{ fontFamily: '"Clash Display", sans-serif', fontSize: "20px", fontWeight: 400, letterSpacing: "-0.02em", color: "#faf5ea" }}>Add Review Manually</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#bababa", cursor: "pointer", fontSize: "20px" }}>✕</button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={labelStyle}>Client Name *</label>
            <input value={form.reviewer_name} onChange={e => setForm(f => ({ ...f, reviewer_name: e.target.value }))} placeholder="e.g. Sarah Johnson" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Title / Role</label>
            <input value={form.reviewer_title} onChange={e => setForm(f => ({ ...f, reviewer_title: e.target.value }))} placeholder="e.g. Bride, Marketing Director" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Company (optional)</label>
            <input value={form.reviewer_company} onChange={e => setForm(f => ({ ...f, reviewer_company: e.target.value }))} placeholder="e.g. Acme Corp" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Rating *</label>
            <div style={{ display: "flex", gap: "8px" }}>
              {[1,2,3,4,5].map(s => (
                <button key={s} type="button" onClick={() => setForm(f => ({ ...f, rating: s }))}
                  style={{ background: "none", border: "none", cursor: "pointer", fontSize: "28px", color: s <= form.rating ? "#ff7738" : "rgba(255,255,255,0.15)", padding: 0 }}>★</button>
              ))}
            </div>
          </div>
          <div>
            <label style={labelStyle}>Review Text *</label>
            <textarea value={form.body} onChange={e => setForm(f => ({ ...f, body: e.target.value }))} rows={4} placeholder="Paste the review text from WhatsApp, Instagram, email etc." style={{ ...inputStyle, resize: "vertical" }} />
          </div>

          {error && <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "13px", color: "#ff7738" }}>{error}</p>}

          <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
            <button onClick={onClose} style={{ flex: 1, fontFamily: '"Clash Display", sans-serif', fontSize: "12px", letterSpacing: "0.08em", textTransform: "uppercase", color: "#bababa", background: "transparent", border: "1px solid rgba(255,255,255,0.1)", padding: "12px", cursor: "pointer" }}>
              Cancel
            </button>
            <button onClick={handleSave} disabled={saving} style={{ flex: 2, fontFamily: '"Clash Display", sans-serif', fontSize: "12px", letterSpacing: "0.08em", textTransform: "uppercase", color: "#0a0a0a", background: saving ? "#bababa" : "#faf5ea", border: "none", padding: "12px", cursor: saving ? "not-allowed" : "pointer" }}>
              {saving ? "Saving…" : "Save & Publish"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminReviewsPage() {
  const supabase = createClient();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("all");
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  async function loadReviews() {
    const { data } = await supabase.from("reviews").select("*").order("created_at", { ascending: false });
    setReviews(data || []);
    setLoading(false);
  }

  useEffect(() => { loadReviews(); }, []);

  async function handleApprove(id: string) {
    setActionLoading(id);
    await supabase.from("reviews").update({ approved: true }).eq("id", id);
    await loadReviews();
    setActionLoading(null);
  }

  async function handleReject(id: string) {
    setActionLoading(id);
    await supabase.from("reviews").update({ approved: false }).eq("id", id);
    await loadReviews();
    setActionLoading(null);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this review permanently? This cannot be undone.")) return;
    setActionLoading(id);
    await supabase.from("reviews").delete().eq("id", id);
    await loadReviews();
    setActionLoading(null);
  }

  const filtered = reviews.filter(r => {
    if (filter === "pending") return !r.approved;
    if (filter === "approved") return r.approved;
    return true;
  });

  const pendingCount = reviews.filter(r => !r.approved).length;

  const sourceLabel: Record<string, string> = {
    client_link: "Auto link",
    manual: "Manual entry",
  };

  return (
    <div>
      {showModal && <ManualAddModal onClose={() => setShowModal(false)} onSaved={loadReviews} />}

      {/* Header */}
      <div style={{ marginBottom: "32px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ fontFamily: '"Clash Display", sans-serif', fontSize: "32px", fontWeight: 400, letterSpacing: "-0.03em", color: "#faf5ea" }}>Reviews</h1>
          {pendingCount > 0 && (
            <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "14px", color: "#ff7738", marginTop: "4px" }}>
              {pendingCount} pending approval
            </p>
          )}
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={{ fontFamily: '"Clash Display", sans-serif', fontSize: "13px", fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase", color: "#0a0a0a", background: "#faf5ea", border: "none", padding: "12px 24px", cursor: "pointer" }}
        >
          + Add Manually
        </button>
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: "4px", marginBottom: "24px" }}>
        {(["all", "pending", "approved"] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "13px", padding: "8px 16px", background: filter === f ? "rgba(255,255,255,0.1)" : "transparent", border: "1px solid", borderColor: filter === f ? "rgba(255,255,255,0.2)" : "transparent", color: filter === f ? "#faf5ea" : "#bababa", cursor: "pointer", borderRadius: "4px", textTransform: "capitalize" }}>
            {f} {f === "all" ? `(${reviews.length})` : f === "pending" ? `(${reviews.filter(r => !r.approved).length})` : `(${reviews.filter(r => r.approved).length})`}
          </button>
        ))}
      </div>

      {/* Reviews list */}
      {loading ? (
        <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "14px", color: "#bababa" }}>Loading…</p>
      ) : filtered.length === 0 ? (
        <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "14px", color: "#bababa" }}>No reviews in this category.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {filtered.map(review => (
            <div key={review.id} style={{ background: "#1a1a1a", border: `1px solid ${!review.approved ? "rgba(255,119,56,0.25)" : "rgba(255,255,255,0.07)"}`, borderRadius: "8px", padding: "24px" }}>
              {/* Top row */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px", gap: "16px", flexWrap: "wrap" }}>
                <div>
                  <p style={{ fontFamily: '"Clash Display", sans-serif', fontSize: "16px", fontWeight: 500, color: "#faf5ea", marginBottom: "2px" }}>{review.reviewer_name}</p>
                  {(review.reviewer_title || review.reviewer_company) && (
                    <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "13px", color: "#bababa" }}>
                      {[review.reviewer_title, review.reviewer_company].filter(Boolean).join(", ")}
                    </p>
                  )}
                </div>
                <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                  <StarDisplay rating={review.rating} />
                  <span style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "11px", letterSpacing: "0.05em", textTransform: "uppercase", color: review.approved ? "#4ade80" : "#ff7738", background: review.approved ? "rgba(74,222,128,0.1)" : "rgba(255,119,56,0.1)", padding: "3px 8px", borderRadius: "3px" }}>
                    {review.approved ? "Published" : "Pending"}
                  </span>
                  {review.source && (
                    <span style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "11px", letterSpacing: "0.05em", textTransform: "uppercase", color: "#bababa", background: "rgba(255,255,255,0.05)", padding: "3px 8px", borderRadius: "3px" }}>
                      {sourceLabel[review.source] || review.source}
                    </span>
                  )}
                </div>
              </div>

              {/* Body */}
              <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "15px", fontWeight: 300, color: "#bababa", lineHeight: 1.7, marginBottom: "20px" }}>
                &ldquo;{review.body}&rdquo;
              </p>

              {/* Actions */}
              <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
                {!review.approved ? (
                  <button onClick={() => handleApprove(review.id)} disabled={actionLoading === review.id}
                    style={{ fontFamily: '"Clash Display", sans-serif', fontSize: "12px", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", color: "#0a0a0a", background: "#4ade80", border: "none", padding: "8px 20px", cursor: "pointer", opacity: actionLoading === review.id ? 0.5 : 1 }}>
                    Approve
                  </button>
                ) : (
                  <button onClick={() => handleReject(review.id)} disabled={actionLoading === review.id}
                    style={{ fontFamily: '"Clash Display", sans-serif', fontSize: "12px", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", color: "#faf5ea", background: "transparent", border: "1px solid rgba(255,255,255,0.15)", padding: "8px 20px", cursor: "pointer", opacity: actionLoading === review.id ? 0.5 : 1 }}>
                    Unpublish
                  </button>
                )}
                <button onClick={() => handleDelete(review.id)} disabled={actionLoading === review.id}
                  style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "13px", color: "#ef4444", background: "none", border: "none", cursor: "pointer", opacity: actionLoading === review.id ? 0.5 : 1 }}>
                  Delete
                </button>
                <span style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "12px", color: "rgba(255,255,255,0.2)", marginLeft: "auto" }}>
                  {new Date(review.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
