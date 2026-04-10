import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Dashboard — Admin" };

async function getDashboardStats() {
  const supabase = await createServerSupabaseClient();

  const [enquiries, albums, posts, reviews, sessions] = await Promise.all([
    supabase.from("enquiries").select("id, status, created_at").order("created_at", { ascending: false }),
    supabase.from("albums").select("id, published"),
    supabase.from("blog_posts").select("id, published"),
    supabase.from("reviews").select("id, approved"),
    supabase.from("sessions").select("id, status, amount, date, client_name, service").order("date", { ascending: true }),
  ]);

  return {
    enquiries: enquiries.data || [],
    albums: albums.data || [],
    posts: posts.data || [],
    reviews: reviews.data || [],
    sessions: sessions.data || [],
  };
}

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.07)", padding: "28px 24px", borderRadius: "8px" }}>
      <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "13px", color: "#bababa", marginBottom: "12px", letterSpacing: "0.02em" }}>{label}</p>
      <p style={{ fontFamily: '"Clash Display", sans-serif', fontSize: "40px", fontWeight: 400, letterSpacing: "-0.04em", color: "#faf5ea", lineHeight: 1 }}>{value}</p>
      {sub && <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "12px", color: "#ff7738", marginTop: "8px" }}>{sub}</p>}
    </div>
  );
}

export default async function AdminDashboardPage() {
  const { enquiries, albums, posts, reviews, sessions } = await getDashboardStats();

  const newEnquiries = enquiries.filter((e) => e.status === "new").length;
  const upcomingSessions = sessions.filter((s) => s.status === "confirmed" && new Date(s.date) >= new Date());
  const totalRevenue = sessions.filter((s) => s.status === "completed").reduce((sum, s) => sum + (Number(s.amount) || 0), 0);

  // Recent enquiries
  const recentEnquiries = enquiries.slice(0, 5);

  return (
    <div>
      <div style={{ marginBottom: "40px" }}>
        <h1 style={{ fontFamily: '"Clash Display", sans-serif', fontSize: "32px", fontWeight: 400, letterSpacing: "-0.03em", color: "#faf5ea", marginBottom: "8px" }}>
          Overview
        </h1>
        <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "14px", color: "#bababa" }}>
          {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "40px" }}>
        <StatCard label="New Enquiries" value={newEnquiries} sub={newEnquiries > 0 ? "Needs attention" : "All caught up"} />
        <StatCard label="Upcoming Sessions" value={upcomingSessions.length} sub={upcomingSessions[0] ? `Next: ${new Date(upcomingSessions[0].date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}` : undefined} />
        <StatCard label="Total Revenue" value={`₦${totalRevenue.toLocaleString()}`} sub="Completed sessions" />
        <StatCard label="Published Albums" value={albums.filter((a) => a.published).length} sub={`${albums.length} total`} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        {/* Recent enquiries */}
        <div style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "8px", overflow: "hidden" }}>
          <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ fontFamily: '"Clash Display", sans-serif', fontSize: "16px", fontWeight: 500, color: "#faf5ea", letterSpacing: "-0.01em" }}>Recent Enquiries</h2>
            <a href="/admin/enquiries" style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "12px", color: "#ff7738", textDecoration: "none" }}>View all</a>
          </div>
          {recentEnquiries.length === 0 ? (
            <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "14px", color: "#bababa", padding: "24px", textAlign: "center" }}>No enquiries yet.</p>
          ) : (
            recentEnquiries.map((e: any) => (
              <div key={e.id} style={{ padding: "14px 24px", borderBottom: "1px solid rgba(255,255,255,0.04)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "14px", color: "#faf5ea" }}>{e.name || "—"}</p>
                  <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "12px", color: "#bababa" }}>{e.service || "General"}</p>
                </div>
                <span style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "11px", letterSpacing: "0.05em", textTransform: "uppercase", color: e.status === "new" ? "#ff7738" : "#bababa", background: e.status === "new" ? "rgba(255,119,56,0.1)" : "rgba(255,255,255,0.05)", padding: "3px 8px", borderRadius: "3px" }}>
                  {e.status}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Upcoming sessions */}
        <div style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "8px", overflow: "hidden" }}>
          <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ fontFamily: '"Clash Display", sans-serif', fontSize: "16px", fontWeight: 500, color: "#faf5ea", letterSpacing: "-0.01em" }}>Upcoming Sessions</h2>
            <a href="/admin/bookings" style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "12px", color: "#ff7738", textDecoration: "none" }}>View all</a>
          </div>
          {upcomingSessions.length === 0 ? (
            <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "14px", color: "#bababa", padding: "24px", textAlign: "center" }}>No upcoming sessions.</p>
          ) : (
            upcomingSessions.slice(0, 5).map((s: any) => (
              <div key={s.id} style={{ padding: "14px 24px", borderBottom: "1px solid rgba(255,255,255,0.04)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "14px", color: "#faf5ea" }}>{s.client_name}</p>
                  <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "12px", color: "#bababa" }}>{s.service}</p>
                </div>
                <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "12px", color: "#bababa" }}>
                  {new Date(s.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Content stats */}
        <div style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "8px", padding: "24px", gridColumn: "span 2" }}>
          <h2 style={{ fontFamily: '"Clash Display", sans-serif', fontSize: "16px", fontWeight: 500, color: "#faf5ea", letterSpacing: "-0.01em", marginBottom: "24px" }}>Content Overview</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
            {[
              { label: "Albums", total: albums.length, published: albums.filter((a) => a.published).length, href: "/admin/albums" },
              { label: "Blog Posts", total: posts.length, published: posts.filter((p) => p.published).length, href: "/admin/blog" },
              { label: "Reviews", total: reviews.length, published: reviews.filter((r) => r.approved).length, href: "/admin/reviews" },
              { label: "Total Enquiries", total: enquiries.length, published: enquiries.filter((e) => e.status !== "archived").length, href: "/admin/enquiries" },
            ].map((item) => (
              <a key={item.label} href={item.href} style={{ textDecoration: "none", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", padding: "20px", borderRadius: "6px", display: "block" }}>
                <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "12px", color: "#bababa", marginBottom: "8px" }}>{item.label}</p>
                <p style={{ fontFamily: '"Clash Display", sans-serif', fontSize: "28px", fontWeight: 400, letterSpacing: "-0.03em", color: "#faf5ea", lineHeight: 1 }}>{item.total}</p>
                <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "12px", color: "#ff7738", marginTop: "6px" }}>{item.published} active</p>
              </a>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1200px) {
          div[style*="grid-template-columns: repeat(4, 1fr)"] { grid-template-columns: repeat(2, 1fr) !important; }
          div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
