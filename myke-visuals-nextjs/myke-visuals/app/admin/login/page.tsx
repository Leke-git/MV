"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError("Invalid credentials. Please try again.");
      setLoading(false);
    } else {
      router.push("/admin/dashboard");
      router.refresh();
    }
  }

  const inputStyle = {
    width: "100%",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "#faf5ea",
    fontFamily: '"Satoshi", sans-serif',
    fontSize: "15px",
    padding: "14px 16px",
    outline: "none",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px" }}>
      <div style={{ width: "100%", maxWidth: "400px" }}>
        {/* Logo */}
        <div style={{ marginBottom: "48px", textAlign: "center" }}>
          <p style={{ fontFamily: '"Clash Display", sans-serif', fontSize: "24px", fontWeight: 400, letterSpacing: "-0.03em", color: "#faf5ea" }}>
            MYKE VISUALS
          </p>
          <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "13px", color: "#bababa", marginTop: "4px" }}>
            Admin Dashboard
          </p>
        </div>

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={{ fontFamily: '"Clash Display", sans-serif', fontSize: "11px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#bababa", display: "block", marginBottom: "8px" }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@mykevisuals.com"
              required
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ fontFamily: '"Clash Display", sans-serif', fontSize: "11px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#bababa", display: "block", marginBottom: "8px" }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={inputStyle}
            />
          </div>

          {error && (
            <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "13px", color: "#ff7738", textAlign: "center" }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{ width: "100%", fontFamily: '"Clash Display", sans-serif', fontSize: "13px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "#0a0a0a", background: loading ? "#bababa" : "#faf5ea", border: "none", padding: "16px", cursor: loading ? "not-allowed" : "pointer", marginTop: "8px" }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "12px", color: "rgba(255,255,255,0.2)", textAlign: "center", marginTop: "40px" }}>
          {/* [README] Create your admin account in Supabase Auth dashboard first */}
          Access restricted to authorised users only.
        </p>
      </div>
    </div>
  );
}
