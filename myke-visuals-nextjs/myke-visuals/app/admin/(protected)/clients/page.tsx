"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

interface Client {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  instagram: string | null;
  referral_source: string | null;
  notes: string | null;
  created_at: string;
}

interface Session {
  id: string;
  service: string;
  date: string | null;
  status: string;
  amount: number | null;
  location: string | null;
}

const REFERRAL_SOURCES = ["instagram", "whatsapp", "website", "referral", "other"];

const STATUS_COLORS: Record<string, { color: string; bg: string }> = {
  pending:   { color: "#ffc838", bg: "rgba(255,200,56,0.12)" },
  confirmed: { color: "#4ade80", bg: "rgba(74,222,128,0.12)" },
  shot:      { color: "#60a5fa", bg: "rgba(96,165,250,0.12)" },
  delivered: { color: "#a78bfa", bg: "rgba(167,139,250,0.12)" },
  closed:    { color: "#bababa", bg: "rgba(255,255,255,0.06)" },
  cancelled: { color: "#ef4444", bg: "rgba(239,68,68,0.12)" },
};

const inp: React.CSSProperties = { width: "100%", background: "#111", border: "1px solid rgba(255,255,255,0.08)", color: "#faf5ea", fontFamily: '"Satoshi", sans-serif', fontSize: "14px", padding: "11px 13px", outline: "none", borderRadius: "4px" };
const lbl: React.CSSProperties = { fontFamily: '"Satoshi", sans-serif', fontSize: "11px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "#bababa", display: "block", marginBottom: "6px" };

function fmt(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}
function fmtN(n: number | null) {
  if (!n) return "—";
  return `₦${Number(n).toLocaleString()}`;
}

// ─── Client Form Modal ────────────────────────────────────────
function ClientModal({ client, onClose, onSaved }: { client?: Client; onClose: () => void; onSaved: () => void }) {
  const supabase = createClient();
  const isEditing = !!client;
  const [form, setForm] = useState({
    name: client?.name || "",
    email: client?.email || "",
    phone: client?.phone || "",
    instagram: client?.instagram || "",
    referral_source: client?.referral_source || "",
    notes: client?.notes || "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSave() {
    if (!form.name.trim()) { setError("Name is required."); return; }
    setSaving(true); setError("");
    const payload = {
      name: form.name.trim(),
      email: form.email.trim() || null,
      phone: form.phone.trim() || null,
      instagram: form.instagram.trim() || null,
      referral_source: form.referral_source || null,
      notes: form.notes.trim() || null,
    };
    const result = isEditing
      ? await supabase.from("clients").update(payload).eq("id", client.id)
      : await supabase.from("clients").insert(payload);
    if (result.error) { setError(result.error.message); setSaving(false); return; }
    onSaved(); onClose();
  }

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 100, display: "flex", alignItems: "flex-start", justifyContent: "flex-end" }}>
      <div style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.08)", width: "100%", maxWidth: "460px", minHeight: "100vh", padding: "32px", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
          <h2 style={{ fontFamily: '"Clash Display", sans-serif', fontSize: "22px", fontWeight: 400, letterSpacing: "-0.02em", color: "#faf5ea" }}>
            {isEditing ? "Edit Client" : "New Client"}
          </h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#555", cursor: "pointer", fontSize: "20px" }}>✕</button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={lbl}>Full Name *</label>
            <input value={form.name} onChange={set("name")} placeholder="e.g. Sarah Johnson" style={inp} />
          </div>
          <div>
            <label style={lbl}>Email</label>
            <input type="email" value={form.email} onChange={set("email")} placeholder="client@email.com" style={inp} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={lbl}>Phone</label>
              <input value={form.phone} onChange={set("phone")} placeholder="+234 800 000 0000" style={inp} />
            </div>
            <div>
              <label style={lbl}>Instagram</label>
              <input value={form.instagram} onChange={set("instagram")} placeholder="@handle" style={inp} />
            </div>
          </div>
          <div>
            <label style={lbl}>How did they find Myke?</label>
            <select value={form.referral_source} onChange={set("referral_source")} style={{ ...inp, cursor: "pointer" }}>
              <option value="">Unknown</option>
              {REFERRAL_SOURCES.map(s => <option key={s} value={s} style={{ textTransform: "capitalize" }}>{s}</option>)}
            </select>
          </div>
          <div>
            <label style={lbl}>Notes</label>
            <textarea value={form.notes} onChange={set("notes")} rows={4} placeholder="Any notes about this client…" style={{ ...inp, resize: "vertical" }} />
          </div>

          {error && <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "13px", color: "#ef4444" }}>{error}</p>}

          <div style={{ display: "flex", gap: "12px", paddingTop: "8px" }}>
            <button onClick={onClose} style={{ flex: 1, fontFamily: '"Clash Display", sans-serif', fontSize: "12px", letterSpacing: "0.08em", textTransform: "uppercase", color: "#bababa", background: "transparent", border: "1px solid rgba(255,255,255,0.1)", padding: "12px", cursor: "pointer", borderRadius: "4px" }}>Cancel</button>
            <button onClick={handleSave} disabled={saving} style={{ flex: 2, fontFamily: '"Clash Display", sans-serif', fontSize: "12px", letterSpacing: "0.08em", textTransform: "uppercase", color: "#0a0a0a", background: saving ? "#666" : "#faf5ea", border: "none", padding: "12px", cursor: saving ? "not-allowed" : "pointer", borderRadius: "4px" }}>
              {saving ? "Saving…" : isEditing ? "Save Changes" : "Add Client"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Client Detail Panel ──────────────────────────────────────
function ClientPanel({ client, onClose, onEdit, onDeleted }: { client: Client; onClose: () => void; onEdit: () => void; onDeleted: () => void }) {
  const supabase = createClient();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    supabase.from("sessions").select("id, service, date, status, amount, location")
      .eq("client_id", client.id).order("date", { ascending: false })
      .then(({ data }) => { setSessions(data || []); setLoadingSessions(false); });
  }, [client.id]);

  async function handleDelete() {
    if (!confirm(`Delete ${client.name}? Their session history will be unlinked but not deleted.`)) return;
    setDeleting(true);
    await supabase.from("clients").delete().eq("id", client.id);
    onDeleted(); onClose();
  }

  const totalValue = sessions.reduce((sum, s) => sum + (Number(s.amount) || 0), 0);
  const waLink = client.phone ? `https://wa.me/${client.phone.replace(/\D/g, "")}` : null;

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 100, display: "flex", alignItems: "flex-start", justifyContent: "flex-end" }}>
      <div style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.08)", width: "100%", maxWidth: "500px", minHeight: "100vh", padding: "32px", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
          <div>
            <h2 style={{ fontFamily: '"Clash Display", sans-serif', fontSize: "24px", fontWeight: 400, letterSpacing: "-0.02em", color: "#faf5ea", marginBottom: "4px" }}>{client.name}</h2>
            <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "12px", color: "#444" }}>Client since {fmt(client.created_at)}</p>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#555", cursor: "pointer", fontSize: "20px" }}>✕</button>
        </div>

        {/* Contact */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "6px", padding: "16px", marginBottom: "20px" }}>
          {client.email && <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "14px", color: "#faf5ea", marginBottom: "6px" }}>{client.email}</p>}
          {client.phone && <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "14px", color: "#bababa", marginBottom: "6px" }}>{client.phone}</p>}
          {client.instagram && <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "13px", color: "#ff7738" }}>{client.instagram}</p>}
          {client.referral_source && <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "12px", color: "#444", marginTop: "8px", textTransform: "capitalize" }}>Via {client.referral_source}</p>}
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
          <div style={{ background: "#111", borderRadius: "6px", padding: "14px 16px" }}>
            <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "11px", color: "#444", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "6px" }}>Total Sessions</p>
            <p style={{ fontFamily: '"Clash Display", sans-serif', fontSize: "28px", color: "#faf5ea", letterSpacing: "-0.03em", lineHeight: 1 }}>{sessions.length}</p>
          </div>
          <div style={{ background: "#111", borderRadius: "6px", padding: "14px 16px" }}>
            <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "11px", color: "#444", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "6px" }}>Total Value</p>
            <p style={{ fontFamily: '"Clash Display", sans-serif', fontSize: "28px", color: "#faf5ea", letterSpacing: "-0.03em", lineHeight: 1 }}>{fmtN(totalValue)}</p>
          </div>
        </div>

        {/* Notes */}
        {client.notes && (
          <div style={{ marginBottom: "20px" }}>
            <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", color: "#444", marginBottom: "8px" }}>Notes</p>
            <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "14px", color: "#bababa", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{client.notes}</p>
          </div>
        )}

        {/* Sessions */}
        <div style={{ marginBottom: "24px" }}>
          <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", color: "#444", marginBottom: "12px" }}>Session History</p>
          {loadingSessions ? (
            <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "13px", color: "#444" }}>Loading…</p>
          ) : sessions.length === 0 ? (
            <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "13px", color: "#444" }}>No sessions yet.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {sessions.map(s => {
                const c = STATUS_COLORS[s.status] || { color: "#bababa", bg: "rgba(255,255,255,0.06)" };
                return (
                  <div key={s.id} style={{ background: "#111", borderRadius: "6px", padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "13px", color: "#faf5ea" }}>{s.service}{s.location ? ` · ${s.location}` : ""}</p>
                      <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "12px", color: "#555", marginTop: "2px" }}>{fmt(s.date)}</p>
                    </div>
                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                      {s.amount && <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "12px", color: "#bababa" }}>{fmtN(s.amount)}</p>}
                      <span style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "10px", letterSpacing: "0.05em", textTransform: "uppercase", color: c.color, background: c.bg, padding: "2px 7px", borderRadius: "3px" }}>{s.status}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {waLink && (
            <a href={waLink} target="_blank" rel="noopener noreferrer" style={{ display: "block", textAlign: "center", fontFamily: '"Clash Display", sans-serif', fontSize: "12px", letterSpacing: "0.08em", textTransform: "uppercase", color: "#0a0a0a", background: "#faf5ea", padding: "13px 24px", textDecoration: "none", borderRadius: "4px" }}>
              Message on WhatsApp
            </a>
          )}
          <button onClick={onEdit} style={{ fontFamily: '"Clash Display", sans-serif', fontSize: "12px", letterSpacing: "0.08em", textTransform: "uppercase", color: "#faf5ea", background: "transparent", border: "1px solid rgba(255,255,255,0.15)", padding: "13px 24px", cursor: "pointer", borderRadius: "4px" }}>
            Edit Client
          </button>
          <button onClick={handleDelete} disabled={deleting} style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "13px", color: "#ef4444", background: "none", border: "none", cursor: "pointer", padding: "8px 0", opacity: deleting ? 0.5 : 1 }}>
            {deleting ? "Deleting…" : "Delete client"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────
export default function ClientsPage() {
  const supabase = createClient();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Client | null>(null);
  const [editing, setEditing] = useState<Client | undefined>();
  const [showForm, setShowForm] = useState(false);

  const load = useCallback(async () => {
    const { data } = await supabase.from("clients").select("*").order("name");
    setClients(data || []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { load(); }, [load]);

  const filtered = clients.filter(c =>
    !search || [c.name, c.email || "", c.phone || "", c.instagram || ""].some(v => v.toLowerCase().includes(search.toLowerCase()))
  );

  const referralBreakdown = REFERRAL_SOURCES.map(s => ({
    source: s,
    count: clients.filter(c => c.referral_source === s).length,
  })).filter(s => s.count > 0);

  return (
    <div>
      {showForm && (
        <ClientModal
          client={editing}
          onClose={() => { setShowForm(false); setEditing(undefined); }}
          onSaved={() => { load(); setSelected(null); }}
        />
      )}
      {selected && !showForm && (
        <ClientPanel
          client={selected}
          onClose={() => setSelected(null)}
          onEdit={() => { setEditing(selected); setShowForm(true); }}
          onDeleted={load}
        />
      )}

      {/* Header */}
      <div style={{ marginBottom: "28px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ fontFamily: '"Clash Display", sans-serif', fontSize: "32px", fontWeight: 400, letterSpacing: "-0.03em", color: "#faf5ea", marginBottom: "4px" }}>Clients</h1>
          <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "13px", color: "#555" }}>{clients.length} total</p>
        </div>
        <button onClick={() => { setEditing(undefined); setShowForm(true); }} style={{ fontFamily: '"Clash Display", sans-serif', fontSize: "13px", fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase", color: "#0a0a0a", background: "#faf5ea", border: "none", padding: "12px 24px", cursor: "pointer", borderRadius: "4px" }}>
          + Add Client
        </button>
      </div>

      {/* Referral breakdown */}
      {referralBreakdown.length > 0 && (
        <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
          {referralBreakdown.map(r => (
            <div key={r.source} style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "6px", padding: "10px 16px", display: "flex", gap: "8px", alignItems: "center" }}>
              <span style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "12px", color: "#555", textTransform: "capitalize" }}>{r.source}</span>
              <span style={{ fontFamily: '"Clash Display", sans-serif', fontSize: "16px", color: "#faf5ea" }}>{r.count}</span>
            </div>
          ))}
        </div>
      )}

      {/* Search */}
      <div style={{ marginBottom: "20px" }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, email, phone, instagram…" style={{ ...inp, maxWidth: "360px" }} />
      </div>

      {/* List */}
      {loading ? (
        <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "14px", color: "#555" }}>Loading…</p>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 40px", background: "#1a1a1a", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.07)" }}>
          <p style={{ fontFamily: '"Clash Display", sans-serif', fontSize: "18px", color: "#faf5ea", marginBottom: "8px" }}>{clients.length === 0 ? "No clients yet" : "No results"}</p>
          <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "14px", color: "#555" }}>{clients.length === 0 ? "Add your first client to get started." : "Try a different search term."}</p>
        </div>
      ) : (
        <div style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "8px", overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 2fr 1.5fr 1fr", padding: "12px 24px", borderBottom: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)" }}>
            {["Name", "Contact", "Instagram", "Since"].map(h => (
              <span key={h} style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: "#444" }}>{h}</span>
            ))}
          </div>
          {filtered.map(c => (
            <div key={c.id} onClick={() => setSelected(c)}
              style={{ display: "grid", gridTemplateColumns: "2fr 2fr 1.5fr 1fr", padding: "16px 24px", borderBottom: "1px solid rgba(255,255,255,0.04)", alignItems: "center", cursor: "pointer", transition: "background 0.15s" }}
              onMouseEnter={el => (el.currentTarget.style.background = "rgba(255,255,255,0.03)")}
              onMouseLeave={el => (el.currentTarget.style.background = "transparent")}
            >
              <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "14px", color: "#faf5ea", fontWeight: 500 }}>{c.name}</p>
              <div>
                {c.email && <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "13px", color: "#bababa" }}>{c.email}</p>}
                {c.phone && <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "12px", color: "#555" }}>{c.phone}</p>}
              </div>
              <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "13px", color: "#ff7738" }}>{c.instagram || "—"}</p>
              <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "12px", color: "#444" }}>{fmt(c.created_at)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
