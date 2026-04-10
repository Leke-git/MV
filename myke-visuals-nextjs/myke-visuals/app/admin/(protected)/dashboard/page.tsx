export const dynamic = "force-dynamic";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Dashboard — Admin" };

async function getDashboardData() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const [profile, enquiries, albums, posts, reviews, sessions, studioBookings] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("enquiries").select("id, name, service, status, enquiry_type, created_at").order("created_at", { ascending: false }),
    supabase.from("albums").select("id, published"),
    supabase.from("blog_posts").select("id, published"),
    supabase.from("reviews").select("id, approved"),
    supabase.from("sessions").select("id, status, amount, deposit_amount, deposit_paid, balance_paid, date, client_name, service, location").order("date", { ascending: true }),
    supabase.from("studio_bookings").select("id, status, total_amount, deposit_paid, balance_paid, start_time, end_time, client_name, booking_type").order("start_time", { ascending: true }),
  ]);

  return {
    profile: profile.data,
    enquiries: enquiries.data || [],
    albums: albums.data || [],
    posts: posts.data || [],
    reviews: reviews.data || [],
    sessions: sessions.data || [],
    studioBookings: studioBookings.data || [],
  };
}

function StatCard({ label, value, sub, accent = false }: { label: string; value: string | number; sub?: string; accent?: boolean }) {
  return (
    <div style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.07)", padding: "28px 24px", borderRadius: "8px" }}>
      <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "13px", color: "#bababa", marginBottom: "12px", letterSpacing: "0.02em" }}>{label}</p>
      <p style={{ fontFamily: '"Clash Display", sans-serif', fontSize: "40px", fontWeight: 400, letterSpacing: "-0.04em", color: accent ? "#ff7738" : "#faf5ea", lineHeight: 1 }}>{value}</p>
      {sub && <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "12px", color: "#ff7738", marginTop: "8px" }}>{sub}</p>}
    </div>
  );
}

function SectionCard({ title, viewAllHref, children }: { title: string; viewAllHref: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "8px", overflow: "hidden" }}>
      <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ fontFamily: '"Clash Display", sans-serif', fontSize: "16px", fontWeight: 500, color: "#faf5ea", letterSpacing: "-0.01em" }}>{title}</h2>
        <Link href={viewAllHref} style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "12px", color: "#ff7738", textDecoration: "none" }}>View all →</Link>
      </div>
      {children}
    </div>
  );
}

function EmptyRow({ message }: { message: string }) {
  return <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "14px", color: "#bababa", padding: "24px", textAlign: "center" }}>{message}</p>;
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, { bg: string; color: string }> = {
    new: { bg: "rgba(255,119,56,0.15)", color: "#ff7738" },
    pending: { bg: "rgba(255,200,56,0.12)", color: "#ffc838" },
    confirmed: { bg: "rgba(74,222,128,0.12)", color: "#4ade80" },
    shot: { bg: "rgba(96,165,250,0.12)", color: "#60a5fa" },
    delivered: { bg: "rgba(167,139,250,0.12)", color: "#a78bfa" },
    closed: { bg: "rgba(255,255,255,0.06)", color: "#bababa" },
    completed: { bg: "rgba(255,255,255,0.06)", color: "#bababa" },
    cancelled: { bg: "rgba(239,68,68,0.12)", color: "#ef4444" },
    active: { bg: "rgba(74,222,128,0.12)", color: "#4ade80" },
    read: { bg: "rgba(255,255,255,0.06)", color: "#bababa" },
    replied: { bg: "rgba(96,165,250,0.12)", color: "#60a5fa" },
    archived: { bg: "rgba(255,255,255,0.04)", color: "#666" },
  };
  const c = colors[status] || { bg: "rgba(255,255,255,0.06)", color: "#bababa" };
  return (
    <span style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "11px", letterSpacing: "0.05em", textTransform: "uppercase", color: c.color, background: c.bg, padding: "3px 8px", borderRadius: "3px" }}>
      {status}
    </span>
  );
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function formatCurrency(amount: number | null) {
  if (!amount) return "—";
  return `₦${Number(amount).toLocaleString()}`;
}

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default async function AdminDashboardPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const { tab } = await searchParams;
  const { profile, enquiries, albums, posts, reviews, sessions, studioBookings } = await getDashboardData();

  const role = profile?.role || "studio_manager";
  const isOwner = role === "owner";
  const firstName = profile?.full_name?.split(" ")[0] || "there";
  const activeTab = tab || "primary";
  const now = new Date();

  // Derived data
  const upcomingSessions = sessions.filter((s: any) => s.status === "confirmed" && s.date && new Date(s.date) >= now);
  const inProgressSessions = sessions.filter((s: any) => ["pending", "shot", "delivered"].includes(s.status));
  const upcomingStudio = studioBookings.filter((b: any) => b.status === "confirmed" && b.start_time && new Date(b.start_time) >= now);
  const newPhotoEnquiries = enquiries.filter((e: any) => e.status === "new" && e.enquiry_type === "photography");
  const newStudioEnquiries = enquiries.filter((e: any) => e.status === "new" && ["studio", "equipment"].includes(e.enquiry_type));
  const pendingSessionBalance = inProgressSessions.reduce((sum: number, s: any) => sum + Math.max(0, (Number(s.amount) || 0) - (Number(s.deposit_amount) || 0)), 0);
  const studioRevenue = studioBookings.filter((b: any) => b.status === "completed").reduce((sum: number, b: any) => sum + (Number(b.total_amount) || 0), 0);
  const pendingStudioBalance = studioBookings.filter((b: any) => !b.balance_paid && ["confirmed", "active"].includes(b.status)).reduce((sum: number, b: any) => sum + (Number(b.total_amount) || 0), 0);
  const totalRevenue =
    sessions.filter((s: any) => s.status === "closed").reduce((sum: number, s: any) => sum + (Number(s.amount) || 0), 0) +
    studioRevenue;

  const tabs = [
    { key: "primary", label: isOwner ? "My Shoots" : "Studio" },
    { key: "secondary", label: isOwner ? "Studio" : "Myke's Itinerary" },
    { key: "overview", label: "Overview" },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "13px", color: "#666", marginBottom: "6px" }}>
          {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </p>
        <h1 style={{ fontFamily: '"Clash Display", sans-serif', fontSize: "36px", fontWeight: 400, letterSpacing: "-0.03em", color: "#faf5ea", marginBottom: "4px" }}>
          {greeting()}, {firstName}.
        </h1>
        <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "13px", color: "#666", textTransform: "capitalize" }}>
          {role.replace("_", " ")}
        </p>
      </div>

      {/* Tab nav */}
      <div style={{ display: "flex", gap: "4px", background: "rgba(255,255,255,0.04)", borderRadius: "8px", padding: "4px", marginBottom: "32px", width: "fit-content" }}>
        {tabs.map(t => (
          <Link key={t.key} href={`?tab=${t.key}`} style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "13px", fontWeight: activeTab === t.key ? 500 : 400, color: activeTab === t.key ? "#faf5ea" : "#bababa", background: activeTab === t.key ? "rgba(255,255,255,0.08)" : "transparent", padding: "8px 20px", borderRadius: "6px", textDecoration: "none" }}>
            {t.label}
          </Link>
        ))}
      </div>

      {/* PRIMARY TAB */}
      {activeTab === "primary" && isOwner && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "32px" }}>
            <StatCard label="New Enquiries" value={newPhotoEnquiries.length} sub={newPhotoEnquiries.length > 0 ? "Needs attention" : "All clear"} accent={newPhotoEnquiries.length > 0} />
            <StatCard label="Upcoming Shoots" value={upcomingSessions.length} sub={upcomingSessions[0]?.date ? `Next: ${formatDate(upcomingSessions[0].date)}` : "None scheduled"} />
            <StatCard label="In Progress" value={inProgressSessions.length} sub="Pending · Shot · Delivered" />
            <StatCard label="Pending Balance" value={formatCurrency(pendingSessionBalance)} sub="Awaiting collection" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
            <SectionCard title="Upcoming Shoots" viewAllHref="/admin/bookings">
              {upcomingSessions.length === 0 ? <EmptyRow message="No confirmed shoots scheduled." /> : upcomingSessions.slice(0, 5).map((s: any) => (
                <div key={s.id} style={{ padding: "14px 24px", borderBottom: "1px solid rgba(255,255,255,0.04)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "14px", color: "#faf5ea" }}>{s.client_name}</p>
                    <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "12px", color: "#bababa" }}>{s.service}{s.location ? ` · ${s.location}` : ""}</p>
                  </div>
                  <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "12px", color: "#bababa" }}>{formatDate(s.date)}</p>
                </div>
              ))}
            </SectionCard>
            <SectionCard title="Photography Enquiries" viewAllHref="/admin/enquiries">
              {newPhotoEnquiries.length === 0 ? <EmptyRow message="No new enquiries." /> : newPhotoEnquiries.slice(0, 5).map((e: any) => (
                <div key={e.id} style={{ padding: "14px 24px", borderBottom: "1px solid rgba(255,255,255,0.04)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "14px", color: "#faf5ea" }}>{e.name || "—"}</p>
                    <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "12px", color: "#bababa" }}>{e.service || "General"}</p>
                  </div>
                  <StatusBadge status={e.status} />
                </div>
              ))}
            </SectionCard>
          </div>
          <SectionCard title="Active Sessions Pipeline" viewAllHref="/admin/bookings">
            {inProgressSessions.length === 0 ? <EmptyRow message="No sessions in progress." /> : inProgressSessions.slice(0, 6).map((s: any) => (
              <div key={s.id} style={{ padding: "14px 24px", borderBottom: "1px solid rgba(255,255,255,0.04)", display: "grid", gridTemplateColumns: "1fr auto auto auto", gap: "16px", alignItems: "center" }}>
                <div>
                  <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "14px", color: "#faf5ea" }}>{s.client_name}</p>
                  <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "12px", color: "#bababa" }}>{s.service}</p>
                </div>
                <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "12px", color: "#bababa" }}>{s.date ? formatDate(s.date) : "—"}</p>
                <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "12px", color: s.deposit_paid ? "#4ade80" : "#ffc838" }}>{s.deposit_paid ? "Deposit ✓" : "Deposit pending"}</p>
                <StatusBadge status={s.status} />
              </div>
            ))}
          </SectionCard>
        </>
      )}

      {/* PRIMARY TAB — Studio Manager */}
      {activeTab === "primary" && !isOwner && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "32px" }}>
            <StatCard label="New Enquiries" value={newStudioEnquiries.length} sub={newStudioEnquiries.length > 0 ? "Needs attention" : "All clear"} accent={newStudioEnquiries.length > 0} />
            <StatCard label="Upcoming Bookings" value={upcomingStudio.length} sub={upcomingStudio[0]?.start_time ? `Next: ${formatDate(upcomingStudio[0].start_time)}` : "None confirmed"} />
            <StatCard label="Studio Revenue" value={formatCurrency(studioRevenue)} sub="Completed bookings" />
            <StatCard label="Pending Balance" value={formatCurrency(pendingStudioBalance)} sub="Awaiting collection" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
            <SectionCard title="Upcoming Studio Bookings" viewAllHref="/admin/studio-bookings">
              {upcomingStudio.length === 0 ? <EmptyRow message="No confirmed studio bookings." /> : upcomingStudio.slice(0, 5).map((b: any) => (
                <div key={b.id} style={{ padding: "14px 24px", borderBottom: "1px solid rgba(255,255,255,0.04)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "14px", color: "#faf5ea" }}>{b.client_name}</p>
                    <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "12px", color: "#bababa", textTransform: "capitalize" }}>{b.booking_type?.replace("_", " ")}</p>
                  </div>
                  <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "12px", color: "#bababa" }}>{formatDate(b.start_time)}</p>
                </div>
              ))}
            </SectionCard>
            <SectionCard title="Studio Enquiries" viewAllHref="/admin/enquiries">
              {newStudioEnquiries.length === 0 ? <EmptyRow message="No new studio enquiries." /> : newStudioEnquiries.slice(0, 5).map((e: any) => (
                <div key={e.id} style={{ padding: "14px 24px", borderBottom: "1px solid rgba(255,255,255,0.04)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "14px", color: "#faf5ea" }}>{e.name || "—"}</p>
                    <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "12px", color: "#bababa", textTransform: "capitalize" }}>{e.enquiry_type?.replace("_", " ") || "General"}</p>
                  </div>
                  <StatusBadge status={e.status} />
                </div>
              ))}
            </SectionCard>
          </div>
        </>
      )}

      {/* SECONDARY TAB — Myke sees studio */}
      {activeTab === "secondary" && isOwner && (
        <SectionCard title="Upcoming Studio Bookings" viewAllHref="/admin/studio-bookings">
          {upcomingStudio.length === 0 ? <EmptyRow message="No confirmed studio bookings." /> : upcomingStudio.slice(0, 8).map((b: any) => (
            <div key={b.id} style={{ padding: "14px 24px", borderBottom: "1px solid rgba(255,255,255,0.04)", display: "grid", gridTemplateColumns: "1fr auto auto", gap: "16px", alignItems: "center" }}>
              <div>
                <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "14px", color: "#faf5ea" }}>{b.client_name}</p>
                <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "12px", color: "#bababa", textTransform: "capitalize" }}>{b.booking_type?.replace("_", " ")}</p>
              </div>
              <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "12px", color: "#bababa" }}>{formatDate(b.start_time)}</p>
              <StatusBadge status={b.status} />
            </div>
          ))}
        </SectionCard>
      )}

      {/* SECONDARY TAB — Studio manager sees Myke's itinerary */}
      {activeTab === "secondary" && !isOwner && (
        <SectionCard title="Myke's Upcoming Itinerary" viewAllHref="/admin/bookings">
          {upcomingSessions.length === 0 ? <EmptyRow message="No upcoming photography sessions." /> : upcomingSessions.slice(0, 8).map((s: any) => (
            <div key={s.id} style={{ padding: "14px 24px", borderBottom: "1px solid rgba(255,255,255,0.04)", display: "grid", gridTemplateColumns: "1fr auto auto auto", gap: "16px", alignItems: "center" }}>
              <div>
                <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "14px", color: "#faf5ea" }}>{s.client_name}</p>
                <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "12px", color: "#bababa" }}>{s.service}{s.location ? ` · ${s.location}` : ""}</p>
              </div>
              <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "12px", color: "#bababa" }}>{s.date ? formatDate(s.date) : "—"}</p>
              <StatusBadge status={s.status} />
            </div>
          ))}
        </SectionCard>
      )}

      {/* OVERVIEW TAB */}
      {activeTab === "overview" && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "32px" }}>
            <StatCard label="All New Enquiries" value={enquiries.filter((e: any) => e.status === "new").length} sub="Photography + Studio" />
            <StatCard label="Upcoming Shoots" value={upcomingSessions.length} sub={upcomingSessions[0]?.date ? `Next: ${formatDate(upcomingSessions[0].date)}` : "None"} />
            <StatCard label="Upcoming Studio" value={upcomingStudio.length} sub={upcomingStudio[0]?.start_time ? `Next: ${formatDate(upcomingStudio[0].start_time)}` : "None"} />
            <StatCard label="Total Revenue" value={formatCurrency(totalRevenue)} sub="Photography + Studio" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
            <SectionCard title="Photography Sessions" viewAllHref="/admin/bookings">
              {sessions.length === 0 ? <EmptyRow message="No sessions yet." /> : sessions.slice(0, 5).map((s: any) => (
                <div key={s.id} style={{ padding: "14px 24px", borderBottom: "1px solid rgba(255,255,255,0.04)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "14px", color: "#faf5ea" }}>{s.client_name}</p>
                    <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "12px", color: "#bababa" }}>{s.service}</p>
                  </div>
                  <StatusBadge status={s.status} />
                </div>
              ))}
            </SectionCard>
            <SectionCard title="Studio Bookings" viewAllHref="/admin/studio-bookings">
              {studioBookings.length === 0 ? <EmptyRow message="No studio bookings yet." /> : studioBookings.slice(0, 5).map((b: any) => (
                <div key={b.id} style={{ padding: "14px 24px", borderBottom: "1px solid rgba(255,255,255,0.04)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "14px", color: "#faf5ea" }}>{b.client_name}</p>
                    <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "12px", color: "#bababa", textTransform: "capitalize" }}>{b.booking_type?.replace("_", " ")}</p>
                  </div>
                  <StatusBadge status={b.status} />
                </div>
              ))}
            </SectionCard>
          </div>
          <div style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "8px", padding: "24px" }}>
            <h2 style={{ fontFamily: '"Clash Display", sans-serif', fontSize: "16px", fontWeight: 500, color: "#faf5ea", letterSpacing: "-0.01em", marginBottom: "20px" }}>Content</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
              {[
                { label: "Albums", total: albums.length, active: albums.filter((a: any) => a.published).length, href: "/admin/albums" },
                { label: "Blog Posts", total: posts.length, active: posts.filter((p: any) => p.published).length, href: "/admin/blog" },
                { label: "Reviews", total: reviews.length, active: reviews.filter((r: any) => r.approved).length, href: "/admin/reviews" },
                { label: "Total Enquiries", total: enquiries.length, active: enquiries.filter((e: any) => e.status !== "archived").length, href: "/admin/enquiries" },
              ].map(item => (
                <Link key={item.label} href={item.href} style={{ textDecoration: "none", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", padding: "20px", borderRadius: "6px", display: "block" }}>
                  <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "12px", color: "#bababa", marginBottom: "8px" }}>{item.label}</p>
                  <p style={{ fontFamily: '"Clash Display", sans-serif', fontSize: "28px", fontWeight: 400, letterSpacing: "-0.03em", color: "#faf5ea", lineHeight: 1 }}>{item.total}</p>
                  <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "12px", color: "#ff7738", marginTop: "6px" }}>{item.active} active</p>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}

      <style>{`
        @media (max-width: 1200px) {
          div[style*="repeat(4, 1fr)"] { grid-template-columns: repeat(2, 1fr) !important; }
          div[style*="1fr 1fr"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
