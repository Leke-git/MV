"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

interface Equipment {
  id: string;
  name: string;
  category: "camera" | "lens" | "lighting" | "grip" | "audio" | "other";
  description: string | null;
  rate_per_day: number | null;
  rate_per_half_day: number | null;
  available: boolean;
  notes: string | null;
  created_at: string;
}

const CATEGORIES = ["camera", "lens", "lighting", "grip", "audio", "other"] as const;

const CATEGORY_COLORS: Record<string, { color: string; bg: string }> = {
  camera:   { color: "#60a5fa", bg: "rgba(96,165,250,0.12)" },
  lens:     { color: "#a78bfa", bg: "rgba(167,139,250,0.12)" },
  lighting: { color: "#ffc838", bg: "rgba(255,200,56,0.12)" },
  grip:     { color: "#4ade80", bg: "rgba(74,222,128,0.12)" },
  audio:    { color: "#ff7738", bg: "rgba(255,119,56,0.12)" },
  other:    { color: "#bababa", bg: "rgba(255,255,255,0.06)" },
};

const inp: React.CSSProperties = { width: "100%", background: "#111", border: "1px solid rgba(255,255,255,0.08)", color: "#faf5ea", fontFamily: '"Satoshi", sans-serif', fontSize: "14px", padding: "11px 13px", outline: "none", borderRadius: "4px" };
const lbl: React.CSSProperties = { fontFamily: '"Satoshi", sans-serif', fontSize: "11px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "#bababa", display: "block", marginBottom: "6px" };

function fmtN(n: number | null) {
  if (!n) return "—";
  return `₦${Number(n).toLocaleString()}`;
}

function EquipmentModal({ item, onClose, onSaved }: { item?: Equipment; onClose: () => void; onSaved: () => void }) {
  const supabase = createClient();
  const isEditing = !!item;
  const [form, setForm] = useState({
    name: item?.name || "",
    category: item?.category || "camera",
    description: item?.description || "",
    rate_per_day: item?.rate_per_day?.toString() || "",
    rate_per_half_day: item?.rate_per_half_day?.toString() || "",
    available: item?.available ?? true,
    notes: item?.notes || "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSave() {
    if (!form.name.trim()) { setError("Name is required."); return; }
    setSaving(true); setError("");
    const payload = {
      name: form.name.trim(),
      category: form.category,
      description: form.description.trim() || null,
      rate_per_day: form.rate_per_day ? parseFloat(form.rate_per_day) : null,
      rate_per_half_day: form.rate_per_half_day ? parseFloat(form.rate_per_half_day) : null,
      available: form.available,
      notes: form.notes.trim() || null,
    };
    const result = isEditing
      ? await supabase.from("equipment").update(payload).eq("id", item.id)
      : await supabase.from("equipment").insert(payload);
    if (result.error) { setError(result.error.message); setSaving(false); return; }
    onSaved(); onClose();
  }

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 100, display: "flex", alignItems: "flex-start", justifyContent: "flex-end" }}>
      <div style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.08)", width: "100%", maxWidth: "440px", minHeight: "100vh", padding: "32px", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
          <h2 style={{ fontFamily: '"Clash Display", sans-serif', fontSize: "22px", fontWeight: 400, letterSpacing: "-0.02em", color: "#faf5ea" }}>{isEditing ? "Edit Equipment" : "Add Equipment"}</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#555", cursor: "pointer", fontSize: "20px" }}>✕</button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={lbl}>Name *</label>
            <input value={form.name} onChange={set("name")} placeholder="e.g. Sony A7 IV" style={inp} />
          </div>

          <div>
            <label style={lbl}>Category</label>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {CATEGORIES.map(cat => {
                const c = CATEGORY_COLORS[cat];
                return (
                  <button key={cat} onClick={() => setForm(f => ({ ...f, category: cat }))}
                    style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "12px", padding: "6px 12px", borderRadius: "4px", cursor: "pointer", border: "none", background: form.category === cat ? c.bg : "rgba(255,255,255,0.04)", color: form.category === cat ? c.color : "#555", textTransform: "capitalize", fontWeight: form.category === cat ? 600 : 400 }}>
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label style={lbl}>Description</label>
            <textarea value={form.description} onChange={set("description")} rows={2} placeholder="Brief description of the equipment…" style={{ ...inp, resize: "vertical" }} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={lbl}>Rate per Day (₦)</label>
              <input type="number" value={form.rate_per_day} onChange={set("rate_per_day")} placeholder="0" style={inp} />
            </div>
            <div>
              <label style={lbl}>Rate per Half Day (₦)</label>
              <input type="number" value={form.rate_per_half_day} onChange={set("rate_per_half_day")} placeholder="0" style={inp} />
            </div>
          </div>

          {/* Availability toggle */}
          <label style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer", padding: "14px 16px", background: "rgba(255,255,255,0.03)", borderRadius: "6px" }}>
            <div onClick={() => setForm(f => ({ ...f, available: !f.available }))}
              style={{ width: "40px", height: "22px", borderRadius: "11px", background: form.available ? "#4ade80" : "rgba(255,255,255,0.1)", position: "relative", cursor: "pointer", transition: "background 0.2s", flexShrink: 0 }}>
              <div style={{ position: "absolute", top: "3px", left: form.available ? "21px" : "3px", width: "16px", height: "16px", borderRadius: "50%", background: "#faf5ea", transition: "left 0.2s" }} />
            </div>
            <div>
              <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "13px", color: form.available ? "#4ade80" : "#bababa", fontWeight: 500 }}>{form.available ? "Available for rental" : "Not available"}</p>
              <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "12px", color: "#444", marginTop: "2px" }}>Toggle if item is out for repair or reserved</p>
            </div>
          </label>

          <div>
            <label style={lbl}>Internal Notes</label>
            <textarea value={form.notes} onChange={set("notes")} rows={2} placeholder="Condition, quirks, accessories included…" style={{ ...inp, resize: "vertical" }} />
          </div>

          {error && <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "13px", color: "#ef4444" }}>{error}</p>}

          <div style={{ display: "flex", gap: "12px", paddingTop: "8px" }}>
            <button onClick={onClose} style={{ flex: 1, fontFamily: '"Clash Display", sans-serif', fontSize: "12px", letterSpacing: "0.08em", textTransform: "uppercase", color: "#bababa", background: "transparent", border: "1px solid rgba(255,255,255,0.1)", padding: "12px", cursor: "pointer", borderRadius: "4px" }}>Cancel</button>
            <button onClick={handleSave} disabled={saving} style={{ flex: 2, fontFamily: '"Clash Display", sans-serif', fontSize: "12px", letterSpacing: "0.08em", textTransform: "uppercase", color: "#0a0a0a", background: saving ? "#666" : "#faf5ea", border: "none", padding: "12px", cursor: saving ? "not-allowed" : "pointer", borderRadius: "4px" }}>
              {saving ? "Saving…" : isEditing ? "Save Changes" : "Add Equipment"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EquipmentPage() {
  const supabase = createClient();
  const [items, setItems] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [availFilter, setAvailFilter] = useState("all");
  const [selected, setSelected] = useState<Equipment | undefined>();
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    const { data } = await supabase.from("equipment").select("*").order("category").order("name");
    setItems(data || []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { load(); }, [load]);

  async function handleDelete(id: string) {
    if (!confirm("Delete this equipment item? Cannot be undone.")) return;
    await supabase.from("equipment").delete().eq("id", id);
    load();
  }

  async function toggleAvailability(item: Equipment) {
    await supabase.from("equipment").update({ available: !item.available }).eq("id", item.id);
    load();
  }

  const filtered = items.filter(i => {
    const mCat = categoryFilter === "all" ? true : i.category === categoryFilter;
    const mAvail = availFilter === "all" ? true : availFilter === "available" ? i.available : !i.available;
    const mSearch = !search || [i.name, i.category, i.description || ""].some(v => v.toLowerCase().includes(search.toLowerCase()));
    return mCat && mAvail && mSearch;
  });

  const available = items.filter(i => i.available).length;
  const unavailable = items.filter(i => !i.available).length;

  return (
    <div>
      {showModal && (
        <EquipmentModal
          item={selected}
          onClose={() => { setShowModal(false); setSelected(undefined); }}
          onSaved={load}
        />
      )}

      <div style={{ marginBottom: "28px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ fontFamily: '"Clash Display", sans-serif', fontSize: "32px", fontWeight: 400, letterSpacing: "-0.03em", color: "#faf5ea", marginBottom: "4px" }}>Equipment</h1>
          <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "13px", color: "#555" }}>{available} available · {unavailable} unavailable</p>
        </div>
        <button onClick={() => { setSelected(undefined); setShowModal(true); }} style={{ fontFamily: '"Clash Display", sans-serif', fontSize: "13px", fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase", color: "#0a0a0a", background: "#faf5ea", border: "none", padding: "12px 24px", cursor: "pointer", borderRadius: "4px" }}>
          + Add Equipment
        </button>
      </div>

      {/* Category breakdown */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
        {CATEGORIES.map(cat => {
          const count = items.filter(i => i.category === cat).length;
          if (!count) return null;
          const c = CATEGORY_COLORS[cat];
          return (
            <div key={cat} style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "6px", padding: "10px 16px", display: "flex", gap: "8px", alignItems: "center" }}>
              <span style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "12px", color: c.color, textTransform: "capitalize" }}>{cat}</span>
              <span style={{ fontFamily: '"Clash Display", sans-serif', fontSize: "16px", color: "#faf5ea" }}>{count}</span>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ display: "flex", gap: "4px" }}>
          {[{ key: "all", label: "All" }, ...CATEGORIES.map(c => ({ key: c, label: c }))].map(f => (
            <button key={f.key} onClick={() => setCategoryFilter(f.key)}
              style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "12px", padding: "6px 12px", background: categoryFilter === f.key ? "rgba(255,255,255,0.1)" : "transparent", border: "1px solid", borderColor: categoryFilter === f.key ? "rgba(255,255,255,0.2)" : "transparent", color: categoryFilter === f.key ? "#faf5ea" : "#666", cursor: "pointer", borderRadius: "4px", textTransform: "capitalize" }}>
              {f.label}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: "4px" }}>
          {[{ key: "all", label: "All" }, { key: "available", label: "Available" }, { key: "unavailable", label: "Unavailable" }].map(f => (
            <button key={f.key} onClick={() => setAvailFilter(f.key)}
              style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "12px", padding: "6px 12px", background: availFilter === f.key ? "rgba(255,255,255,0.08)" : "transparent", border: "1px solid", borderColor: availFilter === f.key ? "rgba(255,255,255,0.15)" : "transparent", color: availFilter === f.key ? "#faf5ea" : "#555", cursor: "pointer", borderRadius: "4px" }}>
              {f.label}
            </button>
          ))}
        </div>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, category…" style={{ ...inp, maxWidth: "220px", padding: "7px 12px" }} />
      </div>

      {/* Grid */}
      {loading ? (
        <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "14px", color: "#555" }}>Loading…</p>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 40px", background: "#1a1a1a", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.07)" }}>
          <p style={{ fontFamily: '"Clash Display", sans-serif', fontSize: "18px", color: "#faf5ea", marginBottom: "8px" }}>{items.length === 0 ? "No equipment yet" : "No results"}</p>
          <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "14px", color: "#555" }}>{items.length === 0 ? "Add your first piece of equipment to the inventory." : "Try a different filter."}</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
          {filtered.map(item => {
            const c = CATEGORY_COLORS[item.category];
            return (
              <div key={item.id} style={{ background: "#1a1a1a", border: `1px solid ${item.available ? "rgba(255,255,255,0.07)" : "rgba(239,68,68,0.15)"}`, borderRadius: "8px", padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontFamily: '"Clash Display", sans-serif', fontSize: "16px", color: "#faf5ea", marginBottom: "4px" }}>{item.name}</p>
                    <span style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "11px", letterSpacing: "0.05em", textTransform: "uppercase", color: c.color, background: c.bg, padding: "2px 7px", borderRadius: "3px" }}>{item.category}</span>
                  </div>
                  <div style={{ display: "flex", gap: "10px", flexShrink: 0 }}>
                    <button onClick={() => { setSelected(item); setShowModal(true); }} style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "12px", color: "#ff7738", background: "none", border: "none", cursor: "pointer", padding: 0 }}>Edit</button>
                    <button onClick={() => handleDelete(item.id)} style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "12px", color: "#444", background: "none", border: "none", cursor: "pointer", padding: 0 }}>Delete</button>
                  </div>
                </div>

                {item.description && <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "13px", color: "#555", lineHeight: 1.5 }}>{item.description}</p>}

                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                  {item.rate_per_day && <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "13px", color: "#bababa" }}>{fmtN(item.rate_per_day)}/day</p>}
                  {item.rate_per_half_day && <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "13px", color: "#555" }}>{fmtN(item.rate_per_half_day)}/half day</p>}
                </div>

                {item.notes && <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "12px", color: "#444", fontStyle: "italic" }}>{item.notes}</p>}

                {/* Availability toggle */}
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "12px", color: item.available ? "#4ade80" : "#ef4444" }}>
                    {item.available ? "Available" : "Unavailable"}
                  </span>
                  <div onClick={() => toggleAvailability(item)}
                    style={{ width: "36px", height: "20px", borderRadius: "10px", background: item.available ? "#4ade80" : "rgba(239,68,68,0.4)", position: "relative", cursor: "pointer", transition: "background 0.2s" }}>
                    <div style={{ position: "absolute", top: "2px", left: item.available ? "18px" : "2px", width: "16px", height: "16px", borderRadius: "50%", background: "#faf5ea", transition: "left 0.2s" }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <style>{`@media (max-width: 900px) { div[style*="repeat(3, 1fr)"] { grid-template-columns: repeat(2, 1fr) !important; } } @media (max-width: 600px) { div[style*="repeat(3, 1fr)"] { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}
