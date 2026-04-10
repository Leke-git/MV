export const dynamic = "force-dynamic";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Enquiries — Admin" };

const statusColors: Record<string, string> = {
  new: "#ff7738",
  read: "#bababa",
  replied: "#4ade80",
  archived: "rgba(255,255,255,0.2)",
};

export default async function AdminEnquiriesPage() {
  const supabase = await createServerSupabaseClient();
  const { data: enquiries } = await supabase
    .from("enquiries")
    .select("*")
    .order("created_at", { ascending: false });

  const list = enquiries || [];
  const newCount = list.filter((e) => e.status === "new").length;

  return (
    <div>
      <div style={{ marginBottom: "40px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <h1 style={{ fontFamily: '"Clash Display", sans-serif', fontSize: "32px", fontWeight: 400, letterSpacing: "-0.03em", color: "#faf5ea" }}>Enquiries</h1>
          {newCount > 0 && <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "14px", color: "#ff7738", marginTop: "4px" }}>{newCount} new {newCount === 1 ? "enquiry" : "enquiries"} waiting</p>}
        </div>
      </div>

      {list.length === 0 ? (
        <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "15px", color: "#bababa" }}>No enquiries yet.</p>
      ) : (
        <div style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "8px", overflow: "hidden" }}>
          {/* Header */}
          <div style={{ display: "grid", gridTemplateColumns: "2fr 2fr 1.5fr 1fr 1fr", padding: "14px 24px", borderBottom: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.03)" }}>
            {["Name", "Email", "Service", "Date", "Status"].map((h) => (
              <span key={h} style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", color: "#bababa" }}>{h}</span>
            ))}
          </div>

          {list.map((e) => (
            <div key={e.id} style={{ display: "grid", gridTemplateColumns: "2fr 2fr 1.5fr 1fr 1fr", padding: "16px 24px", borderBottom: "1px solid rgba(255,255,255,0.04)", alignItems: "center" }}>
              <div>
                <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "14px", color: "#faf5ea", fontWeight: 500 }}>{e.name}</p>
                {e.phone && <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "12px", color: "#bababa" }}>{e.phone}</p>}
              </div>
              <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "13px", color: "#bababa" }}>{e.email}</p>
              <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "13px", color: "#bababa" }}>{e.service || "—"}</p>
              <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "12px", color: "#bababa" }}>
                {new Date(e.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
              </p>
              <span style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "11px", letterSpacing: "0.05em", textTransform: "uppercase", color: statusColors[e.status] || "#bababa", background: "rgba(255,255,255,0.05)", padding: "3px 8px", borderRadius: "3px", width: "fit-content" }}>
                {e.status}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Full message view — click to expand */}
      <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "12px", color: "rgba(255,255,255,0.2)", marginTop: "24px" }}>
        {/* [README] Full enquiry management with message view, status updates, and reply functionality can be added as a Phase 2 enhancement */}
        Click-to-expand with full message view and status management coming in next iteration.
      </p>
    </div>
  );
}
