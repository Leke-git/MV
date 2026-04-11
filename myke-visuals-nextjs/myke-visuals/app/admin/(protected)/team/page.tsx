"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

interface TeamMember {
  id: string;
  full_name: string;
  role: "owner" | "studio_manager" | "admin";
  avatar_url: string | null;
  created_at: string;
  email?: string; // joined from auth.users via API
}

const ROLE_LABELS: Record<string, string> = {
  owner: "Owner",
  admin: "Admin",
  studio_manager: "Studio Manager",
};

const ROLE_DESC: Record<string, string> = {
  owner: "Full access. Can manage team, delete records, and change settings.",
  admin: "Can manage all content, sessions, and bookings. Cannot manage team.",
  studio_manager: "Can manage studio bookings and equipment. Limited CMS access.",
};

const ROLE_COLORS: Record<string, { color: string; bg: string }> = {
  owner: { color: "#ff7738", bg: "rgba(255,119,56,0.12)" },
  admin: { color: "#60a5fa", bg: "rgba(96,165,250,0.12)" },
  studio_manager: { color: "#4ade80", bg: "rgba(74,222,128,0.12)" },
};

const inp: React.CSSProperties = {
  width: "100%", background: "#111", border: "1px solid rgba(255,255,255,0.08)",
  color: "#faf5ea", fontFamily: '"Satoshi", sans-serif', fontSize: "14px",
  padding: "11px 13px", outline: "none", borderRadius: "4px",
};
const lbl: React.CSSProperties = {
  fontFamily: '"Satoshi", sans-serif', fontSize: "11px", fontWeight: 500,
  letterSpacing: "0.08em", textTransform: "uppercase" as const,
  color: "#bababa", display: "block", marginBottom: "6px",
};

function Avatar({ name, url, size = 40 }: { name: string; url?: string | null; size?: number }) {
  if (url) return (
    <img src={url} alt={name} style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
  );
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: "rgba(255,119,56,0.15)", border: "1px solid rgba(255,119,56,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <span style={{ fontFamily: '"Clash Display", sans-serif', fontSize: size * 0.4, color: "#ff7738" }}>
        {name.charAt(0).toUpperCase()}
      </span>
    </div>
  );
}

function InviteModal({ currentUserRole, onClose, onInvited }: {
  currentUserRole: string;
  onClose: () => void;
  onInvited: () => void;
}) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<"admin" | "studio_manager">("studio_manager");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleInvite() {
    if (!email || !name) { setError("Name and email are required."); return; }
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/team/invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, full_name: name, role }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Failed to send invite.");
      setLoading(false);
    } else {
      setSuccess(true);
      setTimeout(() => { onInvited(); onClose(); }, 1500);
    }
  }

  const availableRoles = currentUserRole === "owner"
    ? ["studio_manager", "admin"]
    : ["studio_manager"];

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "32px", width: "100%", maxWidth: "460px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
          <h2 style={{ fontFamily: '"Clash Display", sans-serif', fontSize: "20px", fontWeight: 400, letterSpacing: "-0.02em", color: "#faf5ea" }}>
            Invite Team Member
          </h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#bababa", cursor: "pointer", fontSize: "20px", lineHeight: 1 }}>✕</button>
        </div>

        {success ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <p style={{ fontSize: "32px", marginBottom: "12px" }}>✓</p>
            <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "15px", color: "#4ade80" }}>Invite sent to {email}</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={lbl}>Full Name *</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Tunde Okafor" style={inp} />
            </div>
            <div>
              <label style={lbl}>Email Address *</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tunde@example.com" style={inp} />
            </div>
            <div>
              <label style={lbl}>Role *</label>
              <select value={role} onChange={e => setRole(e.target.value as any)} style={{ ...inp, cursor: "pointer" }}>
                {availableRoles.map(r => (
                  <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                ))}
              </select>
              <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "12px", color: "#666", marginTop: "6px" }}>
                {ROLE_DESC[role]}
              </p>
            </div>

            {error && <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "13px", color: "#ff7738" }}>{error}</p>}

            <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
              <button onClick={onClose} style={{ flex: 1, fontFamily: '"Clash Display", sans-serif', fontSize: "12px", letterSpacing: "0.08em", textTransform: "uppercase", color: "#bababa", background: "transparent", border: "1px solid rgba(255,255,255,0.1)", padding: "12px", cursor: "pointer", borderRadius: "4px" }}>
                Cancel
              </button>
              <button onClick={handleInvite} disabled={loading} style={{ flex: 2, fontFamily: '"Clash Display", sans-serif', fontSize: "12px", letterSpacing: "0.08em", textTransform: "uppercase", color: "#0a0a0a", background: loading ? "#bababa" : "#faf5ea", border: "none", padding: "12px", cursor: loading ? "not-allowed" : "pointer", borderRadius: "4px" }}>
                {loading ? "Sending…" : "Send Invite"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function EditRoleModal({ member, currentUserRole, onClose, onSaved }: {
  member: TeamMember;
  currentUserRole: string;
  onClose: () => void;
  onSaved: () => void;
}) {
  const supabase = createClient();
  const [role, setRole] = useState(member.role);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSave() {
    setLoading(true);
    const { error } = await supabase
      .from("profiles")
      .update({ role })
      .eq("id", member.id);
    if (error) { setError(error.message); setLoading(false); }
    else { onSaved(); onClose(); }
  }

  const availableRoles = currentUserRole === "owner"
    ? ["studio_manager", "admin", "owner"]
    : ["studio_manager"];

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "32px", width: "100%", maxWidth: "400px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <h2 style={{ fontFamily: '"Clash Display", sans-serif', fontSize: "18px", fontWeight: 400, letterSpacing: "-0.02em", color: "#faf5ea" }}>
            Edit Role — {member.full_name}
          </h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#bababa", cursor: "pointer", fontSize: "20px" }}>✕</button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={lbl}>Role</label>
            <select value={role} onChange={e => setRole(e.target.value as any)} style={{ ...inp, cursor: "pointer" }}>
              {availableRoles.map(r => (
                <option key={r} value={r}>{ROLE_LABELS[r]}</option>
              ))}
            </select>
            <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "12px", color: "#666", marginTop: "6px" }}>
              {ROLE_DESC[role]}
            </p>
          </div>

          {error && <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "13px", color: "#ff7738" }}>{error}</p>}

          <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={onClose} style={{ flex: 1, fontFamily: '"Clash Display", sans-serif', fontSize: "12px", letterSpacing: "0.08em", textTransform: "uppercase", color: "#bababa", background: "transparent", border: "1px solid rgba(255,255,255,0.1)", padding: "12px", cursor: "pointer", borderRadius: "4px" }}>
              Cancel
            </button>
            <button onClick={handleSave} disabled={loading} style={{ flex: 2, fontFamily: '"Clash Display", sans-serif', fontSize: "12px", letterSpacing: "0.08em", textTransform: "uppercase", color: "#0a0a0a", background: loading ? "#bababa" : "#faf5ea", border: "none", padding: "12px", cursor: loading ? "not-allowed" : "pointer", borderRadius: "4px" }}>
              {loading ? "Saving…" : "Save Role"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TeamPage() {
  const supabase = createClient();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [currentUser, setCurrentUser] = useState<TeamMember | null>(null);
  const [loading, setLoading] = useState(true);
  const [showInvite, setShowInvite] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [removing, setRemoving] = useState<string | null>(null);

  async function loadTeam() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: profiles } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: true });

    if (profiles) {
      setMembers(profiles);
      const me = profiles.find(p => p.id === user.id);
      setCurrentUser(me || null);
    }
    setLoading(false);
  }

  useEffect(() => { loadTeam(); }, []);

  async function handleRemove(member: TeamMember) {
    if (member.role === "owner") return;
    if (!confirm(`Remove ${member.full_name} from the team? They will lose admin access immediately.`)) return;

    setRemoving(member.id);
    const res = await fetch(`/api/admin/team/remove`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: member.id }),
    });

    if (res.ok) {
      await loadTeam();
    } else {
      alert("Failed to remove user. Please try again.");
    }
    setRemoving(null);
  }

  const isOwner = currentUser?.role === "owner";

  return (
    <div>
      {showInvite && (
        <InviteModal
          currentUserRole={currentUser?.role || ""}
          onClose={() => setShowInvite(false)}
          onInvited={loadTeam}
        />
      )}
      {editingMember && (
        <EditRoleModal
          member={editingMember}
          currentUserRole={currentUser?.role || ""}
          onClose={() => setEditingMember(null)}
          onSaved={loadTeam}
        />
      )}

      {/* Header */}
      <div style={{ marginBottom: "32px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ fontFamily: '"Clash Display", sans-serif', fontSize: "32px", fontWeight: 400, letterSpacing: "-0.03em", color: "#faf5ea" }}>
            Team
          </h1>
          <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "14px", color: "#bababa", marginTop: "4px" }}>
            {members.length} {members.length === 1 ? "member" : "members"}
          </p>
        </div>
        {isOwner && (
          <button
            onClick={() => setShowInvite(true)}
            style={{ fontFamily: '"Clash Display", sans-serif', fontSize: "13px", fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase", color: "#0a0a0a", background: "#faf5ea", border: "none", padding: "12px 24px", cursor: "pointer", borderRadius: "4px" }}
          >
            + Invite Member
          </button>
        )}
      </div>

      {/* Role legend */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "28px", flexWrap: "wrap" }}>
        {Object.entries(ROLE_COLORS).map(([role, colors]) => (
          <div key={role} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "11px", letterSpacing: "0.06em", textTransform: "uppercase", color: colors.color, background: colors.bg, padding: "3px 8px", borderRadius: "3px" }}>
              {ROLE_LABELS[role]}
            </span>
            <span style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "12px", color: "#555" }}>
              {ROLE_DESC[role].split(".")[0]}
            </span>
          </div>
        ))}
      </div>

      {/* Team list */}
      {loading ? (
        <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "14px", color: "#bababa" }}>Loading…</p>
      ) : (
        <div style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "8px", overflow: "hidden" }}>
          {members.map((member, i) => {
            const isMe = member.id === currentUser?.id;
            const canEdit = isOwner && !isMe;
            const canRemove = isOwner && member.role !== "owner";
            const roleColors = ROLE_COLORS[member.role];

            return (
              <div
                key={member.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  padding: "20px 24px",
                  borderBottom: i < members.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                  flexWrap: "wrap",
                }}
              >
                {/* Avatar */}
                <Avatar name={member.full_name} url={member.avatar_url} size={44} />

                {/* Info */}
                <div style={{ flex: 1, minWidth: "180px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                    <p style={{ fontFamily: '"Clash Display", sans-serif', fontSize: "16px", fontWeight: 400, color: "#faf5ea", letterSpacing: "-0.01em" }}>
                      {member.full_name}
                    </p>
                    {isMe && (
                      <span style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "11px", color: "#555", background: "rgba(255,255,255,0.04)", padding: "2px 6px", borderRadius: "3px" }}>
                        You
                      </span>
                    )}
                  </div>
                  <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "13px", color: "#555", marginTop: "2px" }}>
                    {/* [README] Email display requires joining auth.users — shown via invite flow */}
                    Added {new Date(member.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>

                {/* Role badge */}
                <span style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "11px", letterSpacing: "0.06em", textTransform: "uppercase", color: roleColors.color, background: roleColors.bg, padding: "4px 10px", borderRadius: "3px", flexShrink: 0 }}>
                  {ROLE_LABELS[member.role]}
                </span>

                {/* Actions */}
                <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                  {canEdit && (
                    <button
                      onClick={() => setEditingMember(member)}
                      style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "13px", color: "#ff7738", background: "none", border: "none", cursor: "pointer", padding: "4px 8px" }}
                    >
                      Edit Role
                    </button>
                  )}
                  {canRemove && (
                    <button
                      onClick={() => handleRemove(member)}
                      disabled={removing === member.id}
                      style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "13px", color: "#ef4444", background: "none", border: "none", cursor: removing === member.id ? "not-allowed" : "pointer", padding: "4px 8px", opacity: removing === member.id ? 0.5 : 1 }}
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Permissions reference */}
      <div style={{ marginTop: "40px", background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "8px", overflow: "hidden" }}>
        <div style={{ padding: "16px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <h3 style={{ fontFamily: '"Clash Display", sans-serif', fontSize: "15px", fontWeight: 400, color: "#faf5ea" }}>
            Role Permissions
          </h3>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "500px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <th style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", color: "#555", padding: "12px 24px", textAlign: "left", fontWeight: 500 }}>Permission</th>
                {["Owner", "Admin", "Studio Manager"].map(r => (
                  <th key={r} style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", color: "#555", padding: "12px 16px", textAlign: "center", fontWeight: 500 }}>{r}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["View dashboard", true, true, true],
                ["Manage enquiries", true, true, true],
                ["Manage studio bookings", true, true, true],
                ["Manage equipment", true, true, true],
                ["Manage clients & sessions", true, true, false],
                ["Manage albums & blog", true, true, false],
                ["Manage reviews", true, true, false],
                ["Manage team members", true, false, false],
                ["Change site settings", true, false, false],
                ["Delete any record", true, false, false],
              ].map(([label, owner, admin, manager]) => (
                <tr key={label as string} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <td style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "14px", color: "#bababa", padding: "12px 24px" }}>{label as string}</td>
                  {[owner, admin, manager].map((has, i) => (
                    <td key={i} style={{ textAlign: "center", padding: "12px 16px" }}>
                      <span style={{ fontSize: "16px", color: has ? "#4ade80" : "rgba(255,255,255,0.1)" }}>
                        {has ? "✓" : "✕"}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
