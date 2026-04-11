"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

interface StudioBooking {
  id: string;
  client_name: string;
  client_email: string | null;
  client_phone: string | null;
  client_id: string | null;
  booking_type: "studio_hire" | "equipment_rental" | "studio_and_equipment";
  equipment_items: string[];
  start_time: string;
  end_time: string;
  duration_hours: number | null;
  rate_per_hour: number | null;
  total_amount: number | null;
  deposit_amount: number | null;
  deposit_paid: boolean;
  balance_paid: boolean;
  payment_reference: string | null;
  status: "pending" | "confirmed" | "active" | "completed" | "cancelled";
  notes: string | null;
  referral_source: string | null;
  created_at: string;
}

interface Client { id: string; name: string; email: string; phone: string; }

const BOOKING_TYPES = ["studio_hire", "equipment_rental", "studio_and_equipment"] as const;
const STATUSES = ["pending", "confirmed", "active", "completed", "cancelled"] as const;
const REFERRAL_SOURCES = ["instagram", "whatsapp", "website", "referral", "other"];

const STATUS_COLORS: Record<string, { color: string; bg: string }> = {
  pending:   { color: "#ffc838", bg: "rgba(255,200,56,0.12)" },
  confirmed: { color: "#4ade80", bg: "rgba(74,222,128,0.12)" },
  active:    { color: "#60a5fa", bg: "rgba(96,165,250,0.12)" },
  completed: { color: "#bababa", bg: "rgba(255,255,255,0.06)" },
  cancelled: { color: "#ef4444", bg: "rgba(239,68,68,0.12)" },
};

const inp: React.CSSProperties = { width: "100%", background: "#111", border: "1px solid rgba(255,255,255,0.08)", color: "#faf5ea", fontFamily: '"Satoshi", sans-serif', fontSize: "14px", padding: "11px 13px", outline: "none", borderRadius: "4px" };
const lbl: React.CSSProperties = { fontFamily: '"Satoshi", sans-serif', fontSize: "11px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "#bababa", display: "block", marginBottom: "6px" };

function fmt(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}
function fmtN(n: number | null) {
  if (!n) return "—";
  return `₦${Number(n).toLocaleString()}`;
}
function typeLabel(t: string) {
  return t.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
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

function BookingModal({ booking, clients, onClose, onSaved }: { booking?: StudioBooking; clients: Client[]; onClose: () => void; onSaved: () => void }) {
  const supabase = createClient();
  const isEditing = !!booking;

  const [form, setForm] = useState({
    client_id: booking?.client_id || "",
    client_name: booking?.client_name || "",
    client_email: booking?.client_email || "",
    client_phone: booking?.client_phone || "",
    booking_type: booking?.booking_type || "studio_hire",
    equipment_items: booking?.equipment_items?.join(", ") || "",
    start_time: booking?.start_time ? booking.start_time.slice(0, 16) : "",
    end_time: booking?.end_time ? booking.end_time.slice(0, 16) : "",
    rate_per_hour: booking?.rate_per_hour?.toString() || "",
    total_amount: booking?.total_amount?.toString() || "",
    deposit_amount: booking?.deposit_amount?.toString() || "",
    deposit_paid: booking?.deposit_paid || false,
    balance_paid: booking?.balance_paid || false,
    payment_reference: booking?.payment_reference || "",
    status: booking?.status || "pending",
    referral_source: booking?.referral_source || "",
    notes: booking?.notes || "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function handleClientSelect(id: string) {
    const c = clients.find(c => c.id === id);
    setForm(f => ({ ...f, client_id: id, client_name: c?.name || f.client_name, client_email: c?.email || f.client_email, client_phone: c?.phone || f.client_phone }));
  }

  // Auto-calculate total from rate + times
  function calcTotal() {
    if (!form.start_time || !form.end_time || !form.rate_per_hour) return;
    const hours = (new Date(form.end_time).getTime() - new Date(form.start_time).getTime()) / 3600000;
    if (hours > 0) setForm(f => ({ ...f, total_amount: (hours * parseFloat(f.rate_per_hour)).toFixed(0) }));
  }

  async function handleSave() {
    if (!form.client_name.trim()) { setError("Client name is required."); return; }
    if (!form.start_time) { setError("Start time is required."); return; }
    if (!form.end_time) { setError("End time is required."); return; }
    setSaving(true); setError("");

    const start = new Date(form.start_time);
    const end = new Date(form.end_time);
    const durationHours = (end.getTime() - start.getTime()) / 3600000;

    const payload = {
      client_id: form.client_id || null,
      client_name: form.client_name.trim(),
      client_email: form.client_email.trim() || null,
      client_phone: form.client_phone.trim() || null,
      booking_type: form.booking_type,
      equipment_items: form.equipment_items.split(",").map(i => i.trim()).filter(Boolean),
      start_time: form.start_time,
      end_time: form.end_time,
      duration_hours: durationHours > 0 ? durationHours : null,
      rate_per_hour: form.rate_per_hour ? parseFloat(form.rate_per_hour) : null,
      total_amount: form.total_amount ? parseFloat(form.total_amount) : null,
      deposit_amount: form.deposit_amount ? parseFloat(form.deposit_amount) : null,
      deposit_paid: form.deposit_paid,
      balance_paid: form.balance_paid,
      payment_reference: form.payment_reference.trim() || null,
      status: form.status,
      referral_source: form.referral_source || null,
      notes: form.notes.trim() || null,
    };

    const result = isEditing
      ? await supabase.from("studio_bookings").update(payload).eq("id", booking.id)
      : await supabase.from("studio_bookings").insert(payload);

    if (result.error) { setError(result.error.message); setSaving(false); return; }
    onSaved(); onClose();
  }

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 100, display: "flex", alignItems: "flex-start", justifyContent: "flex-end" }}>
      <div style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.08)", width: "100%", maxWidth: "560px", minHeight: "100vh", padding: "32px", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
          <h2 style={{ fontFamily: '"Clash Display", sans-serif', fontSize: "22px", fontWeight: 400, letterSpacing: "-0.02em", color: "#faf5ea" }}>{isEditing ? "Edit Booking" : "New Studio Booking"}</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#555", cursor: "pointer", fontSize: "20px" }}>✕</button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Status — editing only */}
          {isEditing && (
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "6px", padding: "16px" }}>
              <label style={lbl}>Status</label>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {STATUSES.map(s => {
                  const c = STATUS_COLORS[s] || { color: "#bababa", bg: "rgba(255,255,255,0.06)" };
                  return (
                    <button key={s} onClick={() => setForm(f => ({ ...f, status: s }))}
                      style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "12px", letterSpacing: "0.05em", textTransform: "uppercase", padding: "6px 14px", borderRadius: "4px", cursor: "pointer", border: "none", background: form.status === s ? c.bg : "rgba(255,255,255,0.04)", color: form.status === s ? c.color : "#555", fontWeight: form.status === s ? 600 : 400 }}>
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Booking type */}
          <div>
            <label style={lbl}>Booking Type</label>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {BOOKING_TYPES.map(t => (
                <button key={t} onClick={() => setForm(f => ({ ...f, booking_type: t }))}
                  style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "12px", padding: "8px 16px", borderRadius: "4px", cursor: "pointer", border: "1px solid", borderColor: form.booking_type === t ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.08)", color: form.booking_type === t ? "#faf5ea" : "#555", background: form.booking_type === t ? "rgba(255,255,255,0.08)" : "transparent" }}>
                  {typeLabel(t)}
                </button>
              ))}
            </div>
          </div>

          {/* Client */}
          {clients.length > 0 && (
            <div>
              <label style={lbl}>Link to Existing Client</label>
              <select value={form.client_id} onChange={e => handleClientSelect(e.target.value)} style={{ ...inp, cursor: "pointer" }}>
                <option value="">— Select —</option>
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
              <label style={lbl}>Email</label>
              <input type="email" value={form.client_email} onChange={set("client_email")} placeholder="client@email.com" style={inp} />
            </div>
            <div>
              <label style={lbl}>Phone</label>
              <input value={form.client_phone} onChange={set("client_phone")} placeholder="+234…" style={inp} />
            </div>
          </div>

          {/* Times */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={lbl}>Start Time *</label>
              <input type="datetime-local" value={form.start_time} onChange={set("start_time")} onBlur={calcTotal} style={inp} />
            </div>
            <div>
              <label style={lbl}>End Time *</label>
              <input type="datetime-local" value={form.end_time} onChange={set("end_time")} onBlur={calcTotal} style={inp} />
            </div>
          </div>

          {/* Equipment items */}
          {["equipment_rental", "studio_and_equipment"].includes(form.booking_type) && (
            <div>
              <label style={lbl}>Equipment Items (comma separated)</label>
              <textarea value={form.equipment_items} onChange={set("equipment_items")} rows={2} placeholder="Sony A7 IV, Godox AD300 Pro, DJI RS3…" style={{ ...inp, resize: "vertical" }} />
            </div>
          )}

          {/* Financials */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "16px" }}>
            <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", color: "#444", marginBottom: "12px" }}>Financials</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "12px" }}>
              <div>
                <label style={lbl}>Rate/hr (₦)</label>
                <input type="number" value={form.rate_per_hour} onChange={set("rate_per_hour")} onBlur={calcTotal} placeholder="0" style={inp} />
              </div>
              <div>
                <label style={lbl}>Total (₦)</label>
                <input type="number" value={form.total_amount} onChange={set("total_amount")} placeholder="Auto-calculated" style={inp} />
              </div>
              <div>
                <label style={lbl}>Deposit (₦)</label>
                <input type="number" value={form.deposit_amount} onChange={set("deposit_amount")} placeholder="0" style={inp} />
              </div>
            </div>
            <div style={{ marginBottom: "12px" }}>
              <label style={lbl}>Payment Reference</label>
              <input value={form.payment_reference} onChange={set("payment_reference")} placeholder="Transfer ref, receipt number…" style={inp} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <Toggle label="Deposit received" checked={form.deposit_paid} onClick={() => setForm(f => ({ ...f, deposit_paid: !f.deposit_paid }))} />
              <Toggle label="Balance received" checked={form.balance_paid} onClick={() => setForm(f => ({ ...f, balance_paid: !f.balance_paid }))} />
            </div>
          </div>

          <div>
            <label style={lbl}>Referral Source</label>
            <select value={form.referral_source} onChange={set("referral_source")} style={{ ...inp, cursor: "pointer" }}>
              <option value="">Unknown</option>
              {REFERRAL_SOURCES.map(s => <option key={s} value={s} style={{ textTransform: "capitalize" }}>{s}</option>)}
            </select>
          </div>

          <div>
            <label style={lbl}>Notes</label>
            <textarea value={form.notes} onChange={set("notes")} rows={3} placeholder="Internal notes about this booking…" style={{ ...inp, resize: "vertical" }} />
          </div>

          {error && <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "13px", color: "#ef4444" }}>{error}</p>}

          <div style={{ display: "flex", gap: "12px", paddingTop: "8px" }}>
            <button onClick={onClose} style={{ flex: 1, fontFamily: '"Clash Display", sans-serif', fontSize: "12px", letterSpacing: "0.08em", textTransform: "uppercase", color: "#bababa", background: "transparent", border: "1px solid rgba(255,255,255,0.1)", padding: "12px", cursor: "pointer", borderRadius: "4px" }}>Cancel</button>
            <button onClick={handleSave} disabled={saving} style={{ flex: 2, fontFamily: '"Clash Display", sans-serif', fontSize: "12px", letterSpacing: "0.08em", textTransform: "uppercase", color: "#0a0a0a", background: saving ? "#666" : "#faf5ea", border: "none", padding: "12px", cursor: saving ? "not-allowed" : "pointer", borderRadius: "4px" }}>
              {saving ? "Saving…" : isEditing ? "Save Changes" : "Create Booking"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function StudioBookingsPage() {
  const supabase = createClient();
  const [bookings, setBookings] = useState<StudioBooking[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("active");
  const [selected, setSelected] = useState<StudioBooking | undefined>();
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    const [{ data: b }, { data: c }] = await Promise.all([
      supabase.from("studio_bookings").select("*").order("start_time", { ascending: true }),
      supabase.from("clients").select("id, name, email, phone").order("name"),
    ]);
    setBookings(b || []);
    setClients(c || []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { load(); }, [load]);

  async function handleDelete(id: string) {
    if (!confirm("Delete this booking? Cannot be undone.")) return;
    await supabase.from("studio_bookings").delete().eq("id", id);
    load();
  }

  const now = new Date();
  const upcoming = bookings.filter(b => b.status === "confirmed" && new Date(b.start_time) >= now).length;
  const pendingDeposits = bookings.filter(b => !b.deposit_paid && !["cancelled", "completed"].includes(b.status)).length;
  const totalRevenue = bookings.filter(b => b.status === "completed").reduce((s, b) => s + (Number(b.total_amount) || 0), 0);
  const pendingBalance = bookings.filter(b => !b.balance_paid && ["confirmed", "active"].includes(b.status)).reduce((s, b) => s + (Number(b.total_amount) || 0), 0);

  const filtered = bookings.filter(b => {
    const mf = filter === "active" ? !["completed", "cancelled"].includes(b.status) : filter === "all" ? true : b.status === filter;
    const ms = !search || [b.client_name, b.client_email || "", typeLabel(b.booking_type)].some(v => v.toLowerCase().includes(search.toLowerCase()));
    return mf && ms;
  });

  const filterOptions = [
    { key: "active", label: "Active" }, { key: "pending", label: "Pending" }, { key: "confirmed", label: "Confirmed" },
    { key: "active_status", label: "Active" }, { key: "completed", label: "Completed" },
    { key: "cancelled", label: "Cancelled" }, { key: "all", label: "All" },
  ];

  return (
    <div>
      {showModal && (
        <BookingModal
          booking={selected}
          clients={clients}
          onClose={() => { setShowModal(false); setSelected(undefined); }}
          onSaved={load}
        />
      )}

      <div style={{ marginBottom: "28px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ fontFamily: '"Clash Display", sans-serif', fontSize: "32px", fontWeight: 400, letterSpacing: "-0.03em", color: "#faf5ea", marginBottom: "4px" }}>Studio Bookings</h1>
          <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "13px", color: "#555" }}>Studio hire & equipment rental</p>
        </div>
        <button onClick={() => { setSelected(undefined); setShowModal(true); }} style={{ fontFamily: '"Clash Display", sans-serif', fontSize: "13px", fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase", color: "#0a0a0a", background: "#faf5ea", border: "none", padding: "12px 24px", cursor: "pointer", borderRadius: "4px" }}>
          + New Booking
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "28px" }}>
        {[
          { label: "Upcoming", value: upcoming, warn: false },
          { label: "Deposits Pending", value: pendingDeposits, warn: pendingDeposits > 0 },
          { label: "Balance Outstanding", value: fmtN(pendingBalance), warn: pendingBalance > 0 },
          { label: "Studio Revenue", value: fmtN(totalRevenue), warn: false },
        ].map(s => (
          <div key={s.label} style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "6px", padding: "16px 20px" }}>
            <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "11px", color: "#555", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "8px" }}>{s.label}</p>
            <p style={{ fontFamily: '"Clash Display", sans-serif', fontSize: "24px", fontWeight: 400, letterSpacing: "-0.03em", color: s.warn ? "#ff7738" : "#faf5ea", lineHeight: 1 }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
          {[
            { key: "active", label: "Active" }, { key: "pending", label: "Pending" },
            { key: "confirmed", label: "Confirmed" }, { key: "completed", label: "Completed" },
            { key: "cancelled", label: "Cancelled" }, { key: "all", label: "All" },
          ].map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)}
              style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "12px", padding: "6px 12px", background: filter === f.key ? "rgba(255,255,255,0.1)" : "transparent", border: "1px solid", borderColor: filter === f.key ? "rgba(255,255,255,0.2)" : "transparent", color: filter === f.key ? "#faf5ea" : "#666", cursor: "pointer", borderRadius: "4px" }}>
              {f.label}
            </button>
          ))}
        </div>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search client, booking type…" style={{ ...inp, maxWidth: "260px", padding: "7px 12px" }} />
      </div>

      {/* List */}
      {loading ? (
        <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "14px", color: "#555" }}>Loading…</p>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 40px", background: "#1a1a1a", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.07)" }}>
          <p style={{ fontFamily: '"Clash Display", sans-serif', fontSize: "18px", color: "#faf5ea", marginBottom: "8px" }}>No bookings found</p>
          <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "14px", color: "#555" }}>Try a different filter or create a new booking.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {filtered.map(b => {
            const c = STATUS_COLORS[b.status] || { color: "#bababa", bg: "rgba(255,255,255,0.06)" };
            return (
              <div key={b.id} style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "8px", padding: "20px 24px", display: "grid", gridTemplateColumns: "1fr auto", gap: "16px", alignItems: "start" }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px", flexWrap: "wrap" }}>
                    <p style={{ fontFamily: '"Clash Display", sans-serif', fontSize: "17px", color: "#faf5ea" }}>{b.client_name}</p>
                    <span style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "11px", letterSpacing: "0.05em", textTransform: "uppercase", color: c.color, background: c.bg, padding: "3px 8px", borderRadius: "3px" }}>{b.status}</span>
                    <span style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "11px", color: "#555", background: "rgba(255,255,255,0.04)", padding: "3px 8px", borderRadius: "3px" }}>{typeLabel(b.booking_type)}</span>
                  </div>
                  <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginBottom: "8px" }}>
                    <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "13px", color: "#bababa" }}>{fmt(b.start_time)}</p>
                    {b.duration_hours && <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "13px", color: "#555" }}>{b.duration_hours}h</p>}
                    {b.client_phone && <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "13px", color: "#555" }}>{b.client_phone}</p>}
                  </div>
                  {b.equipment_items?.length > 0 && (
                    <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "12px", color: "#555", marginBottom: "8px" }}>{b.equipment_items.join(", ")}</p>
                  )}
                  {b.total_amount && (
                    <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                      <span style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "12px", color: "#555" }}>Total: <span style={{ color: "#faf5ea" }}>{fmtN(b.total_amount)}</span></span>
                      {b.deposit_amount && <span style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "12px", color: b.deposit_paid ? "#4ade80" : "#ffc838" }}>Deposit: {fmtN(b.deposit_amount)} {b.deposit_paid ? "✓" : "pending"}</span>}
                      {!b.balance_paid && b.status !== "cancelled" && <span style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "12px", color: "#ffc838" }}>Balance pending</span>}
                      {b.balance_paid && <span style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "12px", color: "#4ade80" }}>Fully paid ✓</span>}
                    </div>
                  )}
                  {b.notes && <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "12px", color: "#444", marginTop: "8px", fontStyle: "italic" }}>{b.notes}</p>}
                </div>
                <div style={{ display: "flex", gap: "16px", alignItems: "center", flexShrink: 0 }}>
                  <button onClick={() => { setSelected(b); setShowModal(true); }} style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "13px", color: "#ff7738", background: "none", border: "none", cursor: "pointer", padding: 0 }}>Edit</button>
                  <button onClick={() => handleDelete(b.id)} style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "13px", color: "#444", background: "none", border: "none", cursor: "pointer", padding: 0 }}>Delete</button>
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
