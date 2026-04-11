"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  service: string | null;
  message: string;
  status: "new" | "read" | "replied" | "archived";
  enquiry_type: "photography" | "studio" | "equipment" | "general" | null;
  referral_source: string | null;
  created_at: string;
}

const STATUS_OPTIONS = ["new", "read", "replied", "archived"] as const;
const TYPE_OPTIONS = ["photography", "studio", "equipment", "general"] as const;

const STATUS_COLORS: Record<string, { color: string; bg: string }> = {
  new:      { color: "#ff7738", bg: "rgba(255,119,56,0.12)" },
  read:     { color: "#bababa", bg: "rgba(255,255,255,0.06)" },
  replied:  { color: "#4ade80", bg: "rgba(74,222,128,0.12)" },
  archived: { color: "#444",    bg: "rgba(255,255,255,0.03)" },
};

const TYPE_COLORS: Record<string, { color: string; bg: string }> = {
  photography: { color: "#60a5fa", bg: "rgba(96,165,250,0.12)" },
  studio:      { color: "#a78bfa", bg: "rgba(167,139,250,0.12)" },
  equipment:   { color: "#ffc838", bg: "rgba(255,200,56,0.12)" },
  general:     { color: "#bababa", bg: "rgba(255,255,255,0.06)" },
};

function fmt(d: string) {
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function Badge({ label, colorMap }: { label: string; colorMap: Record<string, { color: string; bg: string }> }) {
  const c = colorMap[label] || { color: "#bababa", bg: "rgba(255,255,255,0.06)" };
  return (
    <span style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "11px", letterSpacing: "0.05em", textTransform: "uppercase", color: c.color, background: c.bg, padding: "3px 8px", borderRadius: "3px", whiteSpace: "nowrap" }}>
      {label}
    </span>
  );
}

function EnquiryPanel({ enquiry, onClose, onUpdated }: { enquiry: Enquiry; onClose: () => void; onUpdated: () => void }) {
  const supabase = createClient();
  const [status, setStatus] = useState(enquiry.status);
  const [type, setType] = useState(enquiry.enquiry_type || "general");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleStatusChange(newStatus: typeof status) {
    setSaving(true);
    await supabase.from("enquiries").update({ status: newStatus }).eq("id", enquiry.id);
    setStatus(newStatus);
    onUpdated();
    setSaving(false);
  }

  async function handleTypeChange(newType: string) {
    setSaving(true);
    await supabase.from("enquiries").update({ enquiry_type: newType }).eq("id", enquiry.id);
    setType(newType as typeof type);
    onUpdated();
    setSaving(false);
  }

  async function handleDelete() {
    if (!confirm("Delete this enquiry permanently? Cannot be undone.")) return;
    setDeleting(true);
    await supabase.from("enquiries").delete().eq("id", enquiry.id);
    onUpdated();
    onClose();
  }

  // WhatsApp link
  const waMessage = encodeURIComponent(`Hi ${enquiry.name.split(" ")[0]}, thanks for reaching out to Myke Visuals!`);
  const waLink = enquiry.phone
    ? `https://wa.me/${enquiry.phone.replace(/\D/g, "")}?text=${waMessage}`
    : null;

  const lbl: React.CSSProperties = { fontFamily: '"Satoshi", sans-serif', fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: "#444", display: "block", marginBottom: "8px" };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 100, display: "flex", alignItems: "flex-start", justifyContent: "flex-end" }}>
      <div style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.08)", width: "100%", maxWidth: "500px", minHeight: "100vh", padding: "32px", overflowY: "auto" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
          <div>
            <h2 style={{ fontFamily: '"Clash Display", sans-serif', fontSize: "22px", fontWeight: 400, letterSpacing: "-0.02em", color: "#faf5ea", marginBottom: "4px" }}>{enquiry.name}</h2>
            <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "13px", color: "#555" }}>{fmt(enquiry.created_at)}</p>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#555", cursor: "pointer", fontSize: "20px", lineHeight: 1 }}>✕</button>
        </div>

        {/* Contact info */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "6px", padding: "16px", marginBottom: "20px" }}>
          <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "14px", color: "#faf5ea", marginBottom: "6px" }}>{enquiry.email}</p>
          {enquiry.phone && <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "14px", color: "#bababa", marginBottom: "6px" }}>{enquiry.phone}</p>}
          {enquiry.service && <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "13px", color: "#666" }}>Service: {enquiry.service}</p>}
          {enquiry.referral_source && <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "13px", color: "#666", marginTop: "4px", textTransform: "capitalize" }}>Via: {enquiry.referral_source}</p>}
        </div>

        {/* Message */}
        <div style={{ marginBottom: "24px" }}>
          <label style={lbl}>Message</label>
          <div style={{ background: "#111", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "6px", padding: "16px" }}>
            <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "15px", fontWeight: 300, color: "#bababa", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{enquiry.message}</p>
          </div>
        </div>

        {/* Status */}
        <div style={{ marginBottom: "20px" }}>
          <label style={lbl}>Status</label>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {STATUS_OPTIONS.map(s => (
              <button key={s} onClick={() => handleStatusChange(s)} disabled={saving}
                style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "12px", letterSpacing: "0.05em", textTransform: "uppercase", padding: "6px 14px", borderRadius: "4px", cursor: "pointer", border: "none", background: status === s ? (STATUS_COLORS[s]?.bg || "rgba(255,255,255,0.1)") : "rgba(255,255,255,0.04)", color: status === s ? (STATUS_COLORS[s]?.color || "#faf5ea") : "#555", fontWeight: status === s ? 600 : 400, opacity: saving ? 0.5 : 1 }}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Type */}
        <div style={{ marginBottom: "28px" }}>
          <label style={lbl}>Enquiry Type</label>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {TYPE_OPTIONS.map(t => (
              <button key={t} onClick={() => handleTypeChange(t)} disabled={saving}
                style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "12px", letterSpacing: "0.05em", textTransform: "uppercase", padding: "6px 14px", borderRadius: "4px", cursor: "pointer", border: "none", background: type === t ? (TYPE_COLORS[t]?.bg || "rgba(255,255,255,0.1)") : "rgba(255,255,255,0.04)", color: type === t ? (TYPE_COLORS[t]?.color || "#faf5ea") : "#555", fontWeight: type === t ? 600 : 400, opacity: saving ? 0.5 : 1 }}>
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {waLink && (
            <a href={waLink} target="_blank" rel="noopener noreferrer"
              style={{ display: "block", textAlign: "center", fontFamily: '"Clash Display", sans-serif', fontSize: "12px", letterSpacing: "0.08em", textTransform: "uppercase", color: "#0a0a0a", background: "#faf5ea", padding: "13px 24px", textDecoration: "none", borderRadius: "4px" }}>
              Reply on WhatsApp →
            </a>
          )}
          <a href={`mailto:${enquiry.email}?subject=Re: Your enquiry to Myke Visuals`}
            style={{ display: "block", textAlign: "center", fontFamily: '"Clash Display", sans-serif', fontSize: "12px", letterSpacing: "0.08em", textTransform: "uppercase", color: "#faf5ea", background: "transparent", padding: "13px 24px", textDecoration: "none", borderRadius: "4px", border: "1px solid rgba(255,255,255,0.15)" }}>
            Reply via Email
          </a>
          <button onClick={handleDelete} disabled={deleting}
            style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "13px", color: "#ef4444", background: "none", border: "none", cursor: "pointer", padding: "8px 0", opacity: deleting ? 0.5 : 1 }}>
            {deleting ? "Deleting…" : "Delete enquiry"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function EnquiriesPage() {
  const supabase = createClient();
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("active");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selected, setSelected] = useState<Enquiry | null>(null);
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    const { data } = await supabase.from("enquiries").select("*").order("created_at", { ascending: false });
    setEnquiries(data || []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { load(); }, [load]);

  // Auto-mark as read when opened
  async function handleOpen(e: Enquiry) {
    setSelected(e);
    if (e.status === "new") {
      await supabase.from("enquiries").update({ status: "read" }).eq("id", e.id);
      setEnquiries(prev => prev.map(eq => eq.id === e.id ? { ...eq, status: "read" as const } : eq));
    }
  }

  const filtered = enquiries.filter(e => {
    const mStatus =
      statusFilter === "active" ? ["new", "read"].includes(e.status) :
      statusFilter === "all" ? true :
      e.status === statusFilter;
    const mType = typeFilter === "all" ? true : e.enquiry_type === typeFilter;
    const mSearch = !search || [e.name, e.email, e.service || "", e.message].some(v => v.toLowerCase().includes(search.toLowerCase()));
    return mStatus && mType && mSearch;
  });

  const newCount = enquiries.filter(e => e.status === "new").length;
  const photoCount = enquiries.filter(e => e.enquiry_type === "photography" && e.status === "new").length;
  const studioCount = enquiries.filter(e => ["studio", "equipment"].includes(e.enquiry_type || "") && e.status === "new").length;

  const inp: React.CSSProperties = { background: "#111", border: "1px solid rgba(255,255,255,0.08)", color: "#faf5ea", fontFamily: '"Satoshi", sans-serif', fontSize: "13px", padding: "7px 12px", outline: "none", borderRadius: "4px" };

  return (
    <div>
      {selected && (
        <EnquiryPanel
          enquiry={selected}
          onClose={() => setSelected(null)}
          onUpdated={() => { load(); setSelected(null); }}
        />
      )}

      {/* Header */}
      <div style={{ marginBottom: "28px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ fontFamily: '"Clash Display", sans-serif', fontSize: "32px", fontWeight: 400, letterSpacing: "-0.03em", color: "#faf5ea", marginBottom: "4px" }}>Enquiries</h1>
          {newCount > 0 && <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "13px", color: "#ff7738" }}>{newCount} new {newCount === 1 ? "enquiry" : "enquiries"} waiting</p>}
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "24px" }}>
        {[
          { label: "Total New", value: newCount, warn: newCount > 0 },
          { label: "Photography", value: photoCount, warn: photoCount > 0 },
          { label: "Studio / Equipment", value: studioCount, warn: studioCount > 0 },
        ].map(s => (
          <div key={s.label} style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "6px", padding: "16px 20px" }}>
            <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "11px", color: "#555", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "8px" }}>{s.label}</p>
            <p style={{ fontFamily: '"Clash Display", sans-serif', fontSize: "28px", fontWeight: 400, letterSpacing: "-0.03em", color: s.warn ? "#ff7738" : "#faf5ea", lineHeight: 1 }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: "16px", marginBottom: "20px", flexWrap: "wrap", alignItems: "center" }}>
        {/* Status filter */}
        <div style={{ display: "flex", gap: "4px" }}>
          {[
            { key: "active", label: "Active" },
            { key: "new", label: "New" },
            { key: "read", label: "Read" },
            { key: "replied", label: "Replied" },
            { key: "archived", label: "Archived" },
            { key: "all", label: "All" },
          ].map(f => (
            <button key={f.key} onClick={() => setStatusFilter(f.key)}
              style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "12px", padding: "6px 12px", background: statusFilter === f.key ? "rgba(255,255,255,0.1)" : "transparent", border: "1px solid", borderColor: statusFilter === f.key ? "rgba(255,255,255,0.2)" : "transparent", color: statusFilter === f.key ? "#faf5ea" : "#666", cursor: "pointer", borderRadius: "4px" }}>
              {f.label}
            </button>
          ))}
        </div>

        {/* Type filter */}
        <div style={{ display: "flex", gap: "4px" }}>
          {["all", ...TYPE_OPTIONS].map(t => (
            <button key={t} onClick={() => setTypeFilter(t)}
              style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "12px", padding: "6px 12px", background: typeFilter === t ? "rgba(255,255,255,0.08)" : "transparent", border: "1px solid", borderColor: typeFilter === t ? "rgba(255,255,255,0.15)" : "transparent", color: typeFilter === t ? "#faf5ea" : "#555", cursor: "pointer", borderRadius: "4px", textTransform: "capitalize" }}>
              {t}
            </button>
          ))}
        </div>

        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, email, message…" style={{ ...inp, minWidth: "220px" }} />
      </div>

      {/* List */}
      {loading ? (
        <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "14px", color: "#555" }}>Loading…</p>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 40px", background: "#1a1a1a", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.07)" }}>
          <p style={{ fontFamily: '"Clash Display", sans-serif', fontSize: "18px", color: "#faf5ea", marginBottom: "8px" }}>No enquiries found</p>
          <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "14px", color: "#555" }}>Try a different filter.</p>
        </div>
      ) : (
        <div style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "8px", overflow: "hidden" }}>
          {/* Table header */}
          <div style={{ display: "grid", gridTemplateColumns: "2fr 2fr 1fr 1fr 1fr auto", padding: "12px 24px", borderBottom: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)" }}>
            {["Name", "Email", "Service", "Type", "Status", "Date"].map(h => (
              <span key={h} style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: "#444" }}>{h}</span>
            ))}
          </div>

          {filtered.map(e => (
            <div
              key={e.id}
              onClick={() => handleOpen(e)}
              style={{ display: "grid", gridTemplateColumns: "2fr 2fr 1fr 1fr 1fr auto", padding: "16px 24px", borderBottom: "1px solid rgba(255,255,255,0.04)", alignItems: "center", cursor: "pointer", transition: "background 0.15s", background: e.status === "new" ? "rgba(255,119,56,0.03)" : "transparent" }}
              onMouseEnter={el => (el.currentTarget.style.background = "rgba(255,255,255,0.03)")}
              onMouseLeave={el => (el.currentTarget.style.background = e.status === "new" ? "rgba(255,119,56,0.03)" : "transparent")}
            >
              <div>
                <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "14px", color: "#faf5ea", fontWeight: e.status === "new" ? 500 : 400 }}>{e.name}</p>
                {e.phone && <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "12px", color: "#555" }}>{e.phone}</p>}
              </div>
              <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "13px", color: "#666", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.email}</p>
              <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "13px", color: "#bababa" }}>{e.service || "—"}</p>
              <div>{e.enquiry_type ? <Badge label={e.enquiry_type} colorMap={TYPE_COLORS} /> : <span style={{ color: "#444", fontSize: "13px" }}>—</span>}</div>
              <Badge label={e.status} colorMap={STATUS_COLORS} />
              <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "12px", color: "#444", textAlign: "right" }}>{fmt(e.created_at)}</p>
            </div>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          div[style*="repeat(3, 1fr)"] { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </div>
  );
}
