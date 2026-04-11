"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

interface Client { id: string; name: string; email: string; phone: string; }
interface Session {
  id: string; client_id: string | null; client_name: string; service: string;
  date: string | null; end_date: string | null; location: string | null;
  status: string; amount: number | null; deposit_amount: number | null;
  deposit_paid: boolean; balance_paid: boolean; referral_source: string | null;
  notes: string | null; created_at: string;
}

const STATUSES = ["pending", "confirmed", "shot", "delivered", "closed", "cancelled"];
const SERVICES = ["Portrait", "Wedding", "Commercial", "Editorial", "Fashion", "Event", "Other"];
const REFERRAL_SOURCES = ["instagram", "whatsapp", "website", "referral", "other"];

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  pending:   { bg: "rgba(255,200,56,0.12)",  color: "#ffc838" },
  confirmed: { bg: "rgba(74,222,128,0.12)",  color: "#4ade80" },
  shot:      { bg: "rgba(96,165,250,0.12)",  color: "#60a5fa" },
  delivered: { bg: "rgba(167,139,250,0.12)", color: "#a78bfa" },
  closed:    { bg: "rgba(255,255,255,0.06)", color: "#bababa" },
  cancelled: { bg: "rgba(239,68,68,0.12)",   color: "#ef4444" },
};

function fmt(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}
function fmtN(n: number | null) {
  if (!n) return "—";
  return `₦${Number(n).toLocaleString()}`;
}

const inp: React.CSSProperties = { width: "100%", background: "#111", border: "1px solid rgba(255,255,255,0.08)", color: "#faf5ea", fontFamily: '"Satoshi", sans-serif', fontSize: "14px", padding: "11px 13px", outline: "none", borderRadius: "4px" };
const lbl: React.CSSProperties = { fontFamily: '"Satoshi", sans-serif', fontSize: "11px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "#bababa", display: "block", marginBottom: "6px" };

function StatusBadge({ status }: { status: string }) {
  const c = STATUS_COLORS[status] || { bg: "rgba(255,255,255,0.06)", color: "#bababa" };
  return <span style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "11px", letterSpacing: "0.05em", textTransform: "uppercase", color: c.color, background: c.bg, padding: "3px 8px", borderRadius: "3px", whiteSpace: "nowrap" }}>{status}</span>;
}

function Toggle({ label, checked, onClick }: { label: string; checked: boolean; onClick: () => void }) {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
      <div onClick={onClick} style={{ width: "40px", height: "22px", borderRadius: "11px", background: checked ? "#ff7738" : "rgba(255,255,255,0.1)", position: "relative", cursor: "pointer", transition: "background 0.2s", flexShrink: 0 }}>
        <div style={{ position: "absolute", top: "3px", left: checked ? "21px" : "3px", width: "16px", height: "16px", borderRadius: "50%", background: "#faf5ea", transition: "left 0.2s" }} />
      </div>
      <span style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "13px", color: checked ? "#faf5ea" : "#bababa" }}>{label}</span>
    </label>
  );
}

function SessionModal({ session, clients, onClose, onSaved }: { session?: Session; clients: Client[]; onClose: () => void; onSaved: () => void; }) {
  const supabase = createClient();
  const isEditing = !!session;
  const [form, setForm] = useState({
    client_id: session?.client_id || "", client_name: session?.client_name || "",
    service: session?.service || "", date: session?.date ? session.date.slice(0, 16) : "",
    end_date: session?.end_date ? session.end_date.slice(0, 16) : "",
    location: session?.location || "", status: session?.status || "pending",
    amount: session?.amount?.toString() || "", deposit_amount: session?.deposit_amount?.toString() || "",
    deposit_paid: session?.deposit_paid || false, balance_paid: session?.balance_paid || false,
    referral_source: session?.referral_source || "", notes: session?.notes || "",
  });
  const [saving, setSaving] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [error, setError] = useState("");

  function handleClientSelect(id: string) {
    const c = clients.find(c => c.id === id);
    setForm(f => ({ ...f, client_id: id, client_name: c?.name || f.client_name }));
  }

  async function handleStatusChange(newStatus: string) {
    if (!session) return;
    setStatusUpdating(true);
    try {
      const res = await fetch(`/api/sessions/${session.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: newStatus }) });
      if (!res.ok) throw new Error("Failed");
      setForm(f => ({ ...f, status: newStatus }));
      onSaved();
    } catch { setError("Failed to update status."); }
    setStatusUpdating(false);
  }

  async function handleSave() {
    if (!form.client_name.trim()) { setError("Client name is required."); return; }
    if (!form.service) { setError("Service is required."); return; }
    setSaving(true); setError("");
    const payload = {
      client_id: form.client_id || null, client_name: form.client_name.trim(),
      service: form.service, date: form.date || null, end_date: form.end_date || null,
      location: form.location.trim() || null, status: form.status,
      amount: form.amount ? parseFloat(form.amount) : null,
      deposit_amount: form.deposit_amount ? parseFloat(form.deposit_amount) : null,
      deposit_paid: form.deposit_paid, balance_paid: form.balance_paid,
      referral_source: form.referral_source || null, notes: form.notes.trim() || null,
    };
    const result = isEditing
      ? await supabase.from("sessions").update(payload).eq("id", session.id)
      : await supabase.from("sessions").insert(payload);
    if (result.error) { setError(result.error.message); setSaving(false); return; }
    onSaved(); onClose();
  }

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 100, display: "flex", alignItems: "flex-start", justifyContent: "flex-end" }}>
      <div style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.08)", width: "100%", maxWidth: "520px", minHeight: "100vh", padding: "32px", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
          <h2 style={{ fontFamily: '"Clash Display", sans-serif', fontSize: "22px", fontWeight: 400, letterSpacing: "-0.02em", color: "#faf5ea" }}>{isEditing ? "Edit Session" : "New Session"}</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#666", cursor: "pointer", fontSize: "20px" }}>✕</button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Status pills — only when editing */}
          {isEditing && (
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "6px", padding: "16px" }}>
              <label style={lbl}>Status</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {STATUSES.map(s => (
                  <button key={s} type="button" disabled={statusUpdating} onClick={() => handleStatusChange(s)}
                    style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "12px", letterSpacing: "0.05em", textTransform: "uppercase", padding: "6px 14px", borderRadius: "4px", cursor: "pointer", border: "none", background: form.status === s ? (STATUS_COLORS[s]?.bg || "rgba(255,255,255,0.1)") : "rgba(255,255,255,0.04)", color: form.status === s ? (STATUS_COLORS[s]?.color || "#faf5ea") : "#666", fontWeight: form.status === s ? 600 : 400, opacity: statusUpdating ? 0.5 : 1 }}>
                    {s}
                  </button>
                ))}
              </div>
              {statusUpdating && <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "12px", color: "#ff7738", marginTop: "8px" }}>Updating…</p>}
            </div>
          )}

          {clients.length > 0 && (
            <div>
              <label style={lbl}>Link to Client</label>
              <select value={form.client_id} onChange={e => handleClientSelect(e.target.value)} style={{ ...inp, cursor: "pointer" }}>
                <option value="">— Select existing client —</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          )}

          <div>
            <label style={lbl}>Client Name *</label>
            <input value={form.client_name} onChange={set("client_name")} placeholder="Full name" style={inp} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={lbl}>Service *</label>
              <select value={form.service} onChange={set("service")} style={{ ...inp, cursor: "pointer" }}>
                <option value="">Select…</option>
                {SERVICES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label style={lbl}>Referral Source</label>
              <select value={form.referral_source} onChange={set("referral_source")} style={{ ...inp, cursor: "pointer" }}>
                <option value="">Unknown</option>
                {REFERRAL_SOURCES.map(s => <option key={s} value={s} style={{ textTransform: "capitalize" }}>{s}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={lbl}>Shoot Date</label>
              <input type="datetime-local" value={form.date} onChange={set("date")} style={inp} />
            </div>
            <div>
              <label style={lbl}>End Date</label>
              <input type="datetime-local" value={form.end_date} onChange={set("end_date")} style={inp} />
            </div>
          </div>

          <div>
            <label style={lbl}>Location</label>
            <input value={form.location} onChange={set("location")} placeholder="Abuja, Lagos…" style={inp} />
          </div>

          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "16px" }}>
            <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", color: "#444", marginBottom: "12px" }}>Financials</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
              <div>
                <label style={lbl}>Agreed Amount (₦)</label>
                <input type="number" value={form.amount} onChange={set("amount")} placeholder="0" style={inp} />
              </div>
              <div>
                <label style={lbl}>Deposit Amount (₦)</label>
                <input type="number" value={form.deposit_amount} onChange={set("deposit_amount")} placeholder="0" style={inp} />
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <Toggle label="Deposit received" checked={form.deposit_paid} onClick={() => setForm(f => ({ ...f, deposit_paid: !f.deposit_paid }))} />
              <Toggle label="Balance received" checked={form.balance_paid} onClick={() => setForm(f => ({ ...f, balance_paid: !f.balance_paid }))} />
            </div>
          </div>

          <div>
            <label style={lbl}>Notes</label>
            <textarea value={form.notes} onChange={set("notes")} rows={3} placeholder="Internal notes…" style={{ ...inp, resize: "vertical" }} />
          </div>

          {error && <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "13px", color: "#ef4444" }}>{error}</p>}

          <div style={{ display: "flex", gap: "12px", paddingTop: "8px" }}>
            <button onClick={onClose} style={{ flex: 1, fontFamily: '"Clash Display", sans-serif', fontSize: "12px", letterSpacing: "0.08em", textTransform: "uppercase", color: "#bababa", background: "transparent", border: "1px solid rgba(255,255,255,0.1)", padding: "12px", cursor: "pointer", borderRadius: "4px" }}>Cancel</button>
            <button onClick={handleSave} disabled={saving} style={{ flex: 2, fontFamily: '"Clash Display", sans-serif', fontSize: "12px", letterSpacing: "0.08em", textTransform: "uppercase", color: "#0a0a0a", background: saving ? "#666" : "#faf5ea", border: "none", padding: "12px", cursor: saving ? "not-allowed" : "pointer", borderRadius: "4px" }}>
              {saving ? "Saving…" : isEditing ? "Save Changes" : "Create Session"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BookingsPage() {
  const supabase = createClient();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("active");
  const [selected, setSelected] = useState<Session | undefined>();
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    const [{ data: s }, { data: c }] = await Promise.all([
      supabase.from("sessions").select("*").order("date", { ascending: true }),
      supabase.from("clients").select("id, name, email, phone").order("name"),
    ]);
    setSessions(s || []);
    setClients(c || []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { load(); }, [load]);

  async function handleDelete(id: string) {
    if (!confirm("Delete this session? Cannot be undone.")) return;
    await supabase.from("sessions").delete().eq("id", id);
    load();
  }

  const now = new Date();
  const upcoming = sessions.filter(s => s.status === "confirmed" && s.date && new Date(s.date) >= now).length;
  const inProgress = sessions.filter(s => ["pending", "shot", "delivered"].includes(s.status)).length;
  const pendingDeposits = sessions.filter(s => !s.deposit_paid && !["cancelled","closed"].includes(s.status)).length;
  const pendingBalance = sessions.filter(s => !s.balance_paid && ["confirmed","shot","delivered"].includes(s.status))
    .reduce((sum, s) => sum + Math.max(0, (Number(s.amount)||0) - (Number(s.deposit_amount)||0)), 0);

  const filtered = sessions.filter(s => {
    const mf = filter === "active" ? !["closed","cancelled"].includes(s.status) : filter === "all" ? true : s.status === filter;
    const ms = !search || [s.client_name, s.service, s.location||""].some(v => v.toLowerCase().includes(search.toLowerCase()));
    return mf && ms;
  });

  const filterOptions = [
    { key: "active", label: "Active" }, { key: "pending", label: "Pending" }, { key: "confirmed", label: "Confirmed" },
    { key: "shot", label: "Shot" }, { key: "delivered", label: "Delivered" }, { key: "closed", label: "Closed" },
    { key: "cancelled", label: "Cancelled" }, { key: "all", label: "All" },
  ];

  return (
    <div>
      {showModal && <SessionModal session={selected} clients={clients} onClose={() => { setShowModal(false); setSelected(undefined); }} onSaved={load} />}

      <div style={{ marginBottom: "32px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ fontFamily: '"Clash Display", sans-serif', fontSize: "32px", fontWeight: 400, letterSpacing: "-0.03em", color: "#faf5ea", marginBottom: "4px" }}>Bookings</h1>
          <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "13px", color: "#555" }}>Photography sessions</p>
        </div>
        <button onClick={() => { setSelected(undefined); setShowModal(true); }} style={{ fontFamily: '"Clash Display", sans-serif', fontSize: "13px", fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase", color: "#0a0a0a", background: "#faf5ea", border: "none", padding: "12px 24px", cursor: "pointer", borderRadius: "4px" }}>
          + New Session
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "28px" }}>
        {[
          { label: "Upcoming", value: upcoming, warn: false },
          { label: "In Progress", value: inProgress, warn: false },
          { label: "Deposits Pending", value: pendingDeposits, warn: pendingDeposits > 0 },
          { label: "Balance Outstanding", value: `₦${pendingBalance.toLocaleString()}`, warn: pendingBalance > 0 },
        ].map(s => (
          <div key={s.label} style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "6px", padding: "16px 20px" }}>
            <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "11px", color: "#555", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "8px" }}>{s.label}</p>
            <p style={{ fontFamily: '"Clash Display", sans-serif', fontSize: "28px", fontWeight: 400, letterSpacing: "-0.03em", color: s.warn ? "#ff7738" : "#faf5ea", lineHeight: 1 }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters + search */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
          {filterOptions.map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)}
              style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "12px", padding: "6px 14px", background: filter === f.key ? "rgba(255,255,255,0.1)" : "transparent", border: "1px solid", borderColor: filter === f.key ? "rgba(255,255,255,0.2)" : "transparent", color: filter === f.key ? "#faf5ea" : "#666", cursor: "pointer", borderRadius: "4px" }}>
              {f.label}
            </button>
          ))}
        </div>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search client, service, location…" style={{ ...inp, maxWidth: "260px", padding: "7px 12px" }} />
      </div>

      {/* List */}
      {loading ? (
        <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "14px", color: "#555" }}>Loading…</p>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 40px", background: "#1a1a1a", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.07)" }}>
          <p style={{ fontFamily: '"Clash Display", sans-serif', fontSize: "18px", color: "#faf5ea", marginBottom: "8px" }}>No sessions found</p>
          <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "14px", color: "#555" }}>Try a different filter or create a new session.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {filtered.map(s => {
            const balance = Math.max(0, (Number(s.amount)||0) - (Number(s.deposit_amount)||0));
            return (
              <div key={s.id} style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "8px", padding: "20px 24px", display: "grid", gridTemplateColumns: "1fr auto", gap: "16px", alignItems: "start" }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px", flexWrap: "wrap" }}>
                    <p style={{ fontFamily: '"Clash Display", sans-serif', fontSize: "17px", fontWeight: 400, letterSpacing: "-0.01em", color: "#faf5ea" }}>{s.client_name}</p>
                    <StatusBadge status={s.status} />
                  </div>
                  <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                    <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "13px", color: "#bababa" }}>{s.service}</p>
                    {s.date && <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "13px", color: "#666" }}>{fmt(s.date)}</p>}
                    {s.location && <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "13px", color: "#666" }}>{s.location}</p>}
                  </div>
                  {s.amount && (
                    <div style={{ display: "flex", gap: "16px", marginTop: "10px", flexWrap: "wrap" }}>
                      <span style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "12px", color: "#555" }}>Total: <span style={{ color: "#faf5ea" }}>{fmtN(s.amount)}</span></span>
                      {s.deposit_amount && <span style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "12px", color: s.deposit_paid ? "#4ade80" : "#ffc838" }}>Deposit: {fmtN(s.deposit_amount)} {s.deposit_paid ? "✓" : "pending"}</span>}
                      {balance > 0 && <span style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "12px", color: s.balance_paid ? "#4ade80" : "#ffc838" }}>Balance: {fmtN(balance)} {s.balance_paid ? "✓" : "pending"}</span>}
                    </div>
                  )}
                  {s.notes && <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "12px", color: "#444", marginTop: "8px", fontStyle: "italic" }}>{s.notes}</p>}
                </div>
                <div style={{ display: "flex", gap: "16px", alignItems: "center", flexShrink: 0 }}>
                  <button onClick={() => { setSelected(s); setShowModal(true); }} style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "13px", color: "#ff7738", background: "none", border: "none", cursor: "pointer", padding: 0 }}>Edit</button>
                  <button onClick={() => handleDelete(s.id)} style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "13px", color: "#444", background: "none", border: "none", cursor: "pointer", padding: 0 }}>Delete</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <style>{`@media (max-width: 768px) { div[style*="repeat(4, 1fr)"] { grid-template-columns: repeat(2, 1fr) !important; } }`}</style>
    </div>
  );
}
