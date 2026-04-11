"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

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

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "8px", overflow: "hidden", marginBottom: "24px" }}>
      <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <h2 style={{ fontFamily: '"Clash Display", sans-serif', fontSize: "16px", fontWeight: 400, color: "#faf5ea", letterSpacing: "-0.01em" }}>{title}</h2>
        {description && <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "13px", color: "#555", marginTop: "4px" }}>{description}</p>}
      </div>
      <div style={{ padding: "24px" }}>
        {children}
      </div>
    </div>
  );
}

function SaveButton({ onClick, loading, saved }: { onClick: () => void; loading: boolean; saved: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      style={{ fontFamily: '"Clash Display", sans-serif', fontSize: "12px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "#0a0a0a", background: saved ? "#4ade80" : loading ? "#bababa" : "#faf5ea", border: "none", padding: "10px 24px", cursor: loading ? "not-allowed" : "pointer", borderRadius: "4px", transition: "background 0.2s ease", minWidth: "120px" }}
    >
      {saved ? "Saved ✓" : loading ? "Saving…" : "Save Changes"}
    </button>
  );
}

export default function SettingsPage() {
  const supabase = createClient();

  // Profile state
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [fullName, setFullName] = useState("");
  const [currentUserId, setCurrentUserId] = useState("");
  const [currentRole, setCurrentRole] = useState("");

  // Password state
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Business info state
  const [bizLoading, setBizLoading] = useState(false);
  const [bizSaved, setBizSaved] = useState(false);
  const [businessEmail, setBusinessEmail] = useState("");
  const [whatsappLink, setWhatsappLink] = useState("");
  const [instagramHandle, setInstagramHandle] = useState("");
  const [calLink, setCalLink] = useState("");
  const [location, setLocation] = useState("Abuja, Nigeria");

  // Notification state
  const [notifLoading, setNotifLoading] = useState(false);
  const [notifSaved, setNotifSaved] = useState(false);
  const [notifyEnquiry, setNotifyEnquiry] = useState(true);
  const [notifyBooking, setNotifyBooking] = useState(true);
  const [notifyReview, setNotifyReview] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setCurrentUserId(user.id);

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, role")
        .eq("id", user.id)
        .single();

      if (profile) {
        setFullName(profile.full_name || "");
        setCurrentRole(profile.role || "");
      }

      // Load site settings from localStorage as a lightweight store
      // [README] For multi-user consistency, move these to a site_settings table in Supabase
      const saved = localStorage.getItem("mv_settings");
      if (saved) {
        const s = JSON.parse(saved);
        setBusinessEmail(s.businessEmail || "");
        setWhatsappLink(s.whatsappLink || "");
        setInstagramHandle(s.instagramHandle || "");
        setCalLink(s.calLink || "");
        setLocation(s.location || "Abuja, Nigeria");
        setNotifyEnquiry(s.notifyEnquiry ?? true);
        setNotifyBooking(s.notifyBooking ?? true);
        setNotifyReview(s.notifyReview ?? true);
      }
    }
    load();
  }, []);

  async function saveProfile() {
    setProfileLoading(true);
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName })
      .eq("id", currentUserId);

    setProfileLoading(false);
    if (!error) {
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 2500);
    }
  }

  async function savePassword() {
    setPasswordError("");
    if (newPassword !== confirmPassword) { setPasswordError("New passwords don't match."); return; }
    if (newPassword.length < 8) { setPasswordError("Password must be at least 8 characters."); return; }

    setPasswordLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setPasswordLoading(false);

    if (error) {
      setPasswordError(error.message);
    } else {
      setPasswordSaved(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPasswordSaved(false), 2500);
    }
  }

  function saveBusiness() {
    setBizLoading(true);
    const settings = { businessEmail, whatsappLink, instagramHandle, calLink, location };
    const existing = localStorage.getItem("mv_settings");
    const merged = { ...(existing ? JSON.parse(existing) : {}), ...settings };
    localStorage.setItem("mv_settings", JSON.stringify(merged));
    setTimeout(() => {
      setBizLoading(false);
      setBizSaved(true);
      setTimeout(() => setBizSaved(false), 2500);
    }, 400);
  }

  function saveNotifications() {
    setNotifLoading(true);
    const settings = { notifyEnquiry, notifyBooking, notifyReview };
    const existing = localStorage.getItem("mv_settings");
    const merged = { ...(existing ? JSON.parse(existing) : {}), ...settings };
    localStorage.setItem("mv_settings", JSON.stringify(merged));
    setTimeout(() => {
      setNotifLoading(false);
      setNotifSaved(true);
      setTimeout(() => setNotifSaved(false), 2500);
    }, 400);
  }

  const toggle = (val: boolean, setter: (v: boolean) => void) => (
    <button
      onClick={() => setter(!val)}
      style={{ width: "44px", height: "24px", borderRadius: "12px", background: val ? "#ff7738" : "rgba(255,255,255,0.1)", border: "none", cursor: "pointer", position: "relative", transition: "background 0.2s ease", flexShrink: 0 }}
    >
      <span style={{ position: "absolute", top: "3px", left: val ? "23px" : "3px", width: "18px", height: "18px", borderRadius: "50%", background: "#fff", transition: "left 0.2s ease", display: "block" }} />
    </button>
  );

  const fieldRow = (label: string, val: boolean, setter: (v: boolean) => void, desc: string) => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", padding: "14px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
      <div>
        <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "14px", color: "#faf5ea" }}>{label}</p>
        <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "12px", color: "#555", marginTop: "2px" }}>{desc}</p>
      </div>
      {toggle(val, setter)}
    </div>
  );

  return (
    <div style={{ maxWidth: "680px" }}>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontFamily: '"Clash Display", sans-serif', fontSize: "32px", fontWeight: 400, letterSpacing: "-0.03em", color: "#faf5ea" }}>Settings</h1>
        <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "14px", color: "#bababa", marginTop: "4px" }}>
          Manage your profile, business info, and preferences.
        </p>
      </div>

      {/* Profile */}
      <Section title="Your Profile" description="Update your display name shown in the dashboard.">
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={lbl}>Full Name</label>
            <input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Your name" style={inp} />
          </div>
          <div>
            <label style={lbl}>Role</label>
            <input value={currentRole === "studio_manager" ? "Studio Manager" : currentRole.charAt(0).toUpperCase() + currentRole.slice(1)} disabled style={{ ...inp, color: "#555", cursor: "not-allowed" }} />
            <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "12px", color: "#444", marginTop: "6px" }}>
              Your role is set by the account owner. Contact them to change it.
            </p>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <SaveButton onClick={saveProfile} loading={profileLoading} saved={profileSaved} />
          </div>
        </div>
      </Section>

      {/* Password */}
      <Section title="Change Password" description="Use a strong password of at least 8 characters.">
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={lbl}>New Password</label>
            <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="••••••••" style={inp} autoComplete="new-password" />
          </div>
          <div>
            <label style={lbl}>Confirm New Password</label>
            <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="••••••••" style={inp} autoComplete="new-password" />
          </div>
          {passwordError && <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "13px", color: "#ff7738" }}>{passwordError}</p>}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <SaveButton onClick={savePassword} loading={passwordLoading} saved={passwordSaved} />
          </div>
        </div>
      </Section>

      {/* Business Info */}
      <Section title="Business Information" description="Contact details used in automated emails and the public site.">
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={lbl}>Business Email</label>
            <input value={businessEmail} onChange={e => setBusinessEmail(e.target.value)} placeholder="info@mykevisuals.com" type="email" style={inp} />
            <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "12px", color: "#444", marginTop: "6px" }}>
              {/* [README] Update RESEND_TO_EMAIL in .env to match this */}
              This should match RESEND_TO_EMAIL in your environment variables.
            </p>
          </div>
          <div>
            <label style={lbl}>WhatsApp Link</label>
            <input value={whatsappLink} onChange={e => setWhatsappLink(e.target.value)} placeholder="https://wa.me/message/XXXXXX" style={inp} />
          </div>
          <div>
            <label style={lbl}>Instagram Handle</label>
            <input value={instagramHandle} onChange={e => setInstagramHandle(e.target.value)} placeholder="@mykevisuals" style={inp} />
          </div>
          <div>
            <label style={lbl}>Cal.com Booking Link</label>
            <input value={calLink} onChange={e => setCalLink(e.target.value)} placeholder="https://cal.com/mykevisuals/session" style={inp} />
            <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "12px", color: "#444", marginTop: "6px" }}>
              {/* [README] Update NEXT_PUBLIC_CAL_BOOKING_URL in .env to match */}
              Also update NEXT_PUBLIC_CAL_BOOKING_URL in your environment variables.
            </p>
          </div>
          <div>
            <label style={lbl}>Studio Location</label>
            <input value={location} onChange={e => setLocation(e.target.value)} placeholder="Abuja, Nigeria" style={inp} />
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <SaveButton onClick={saveBusiness} loading={bizLoading} saved={bizSaved} />
          </div>
        </div>
      </Section>

      {/* Notifications */}
      <Section title="Email Notifications" description="Choose which events trigger an email notification to you.">
        <div>
          {fieldRow("New Enquiry", notifyEnquiry, setNotifyEnquiry, "Email when a contact form submission comes in")}
          {fieldRow("New Booking", notifyBooking, setNotifyBooking, "Email when a studio booking is created")}
          {fieldRow("New Review", notifyReview, setNotifyReview, "Email when a client submits a review")}
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px" }}>
          <SaveButton onClick={saveNotifications} loading={notifLoading} saved={notifSaved} />
        </div>
      </Section>

      {/* Danger Zone */}
      {currentRole === "owner" && (
        <Section title="Danger Zone" description="Irreversible actions. Proceed with caution.">
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "24px", padding: "16px", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "6px", flexWrap: "wrap" }}>
              <div>
                <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "14px", color: "#faf5ea" }}>Export all data</p>
                <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "12px", color: "#555", marginTop: "2px" }}>Download a CSV of all clients, sessions, enquiries, and reviews.</p>
              </div>
              <button
                onClick={() => alert("Data export coming soon. For now, use Supabase Dashboard → Table Editor to export individual tables.")}
                style={{ fontFamily: '"Clash Display", sans-serif', fontSize: "12px", letterSpacing: "0.06em", textTransform: "uppercase", color: "#faf5ea", background: "transparent", border: "1px solid rgba(255,255,255,0.15)", padding: "10px 20px", cursor: "pointer", borderRadius: "4px", whiteSpace: "nowrap" as const }}
              >
                Export Data
              </button>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "24px", padding: "16px", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "6px", flexWrap: "wrap" }}>
              <div>
                <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "14px", color: "#ef4444" }}>Sign out all sessions</p>
                <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "12px", color: "#555", marginTop: "2px" }}>Force sign out from all devices. You'll need to log in again.</p>
              </div>
              <button
                onClick={async () => {
                  if (!confirm("Sign out from all devices?")) return;
                  await supabase.auth.signOut({ scope: "global" });
                  window.location.href = "/admin/login";
                }}
                style={{ fontFamily: '"Clash Display", sans-serif', fontSize: "12px", letterSpacing: "0.06em", textTransform: "uppercase", color: "#ef4444", background: "transparent", border: "1px solid rgba(239,68,68,0.3)", padding: "10px 20px", cursor: "pointer", borderRadius: "4px", whiteSpace: "nowrap" as const }}
              >
                Sign Out All
              </button>
            </div>
          </div>
        </Section>
      )}
    </div>
  );
}
