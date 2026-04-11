"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard, BookOpen, Image, Star, MessageSquare,
  Calendar, Users, Globe, LogOut, Camera, Package, UserCog, Settings,
} from "lucide-react";

interface Props {
  userEmail: string;
  userName: string;
  userRole: string;
}

export default function AdminSidebar({ userEmail, userName, userRole }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const isOwner = userRole === "owner";
  const isStudioManager = userRole === "studio_manager";

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  const isActive = (href: string) =>
    pathname === href || (href !== "/admin/dashboard" && pathname.startsWith(href));

  const roleLabel: Record<string, string> = {
    owner: "Owner",
    studio_manager: "Studio Manager",
    admin: "Admin",
  };

  const primaryNav = isStudioManager
    ? [
        { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
        { label: "Studio Bookings", href: "/admin/studio-bookings", icon: Camera },
        { label: "Equipment", href: "/admin/equipment", icon: Package },
        { label: "Enquiries", href: "/admin/enquiries", icon: MessageSquare },
        { label: "Clients", href: "/admin/clients", icon: Users },
      ]
    : [
        { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
        { label: "Bookings", href: "/admin/bookings", icon: Calendar },
        { label: "Clients", href: "/admin/clients", icon: Users },
        { label: "Enquiries", href: "/admin/enquiries", icon: MessageSquare },
      ];

  const secondaryNav = isStudioManager
    ? [{ label: "Myke's Bookings", href: "/admin/bookings", icon: Calendar }]
    : [
        { label: "Studio Bookings", href: "/admin/studio-bookings", icon: Camera },
        { label: "Equipment", href: "/admin/equipment", icon: Package },
      ];

  const contentNav = [
    { label: "Albums", href: "/admin/albums", icon: Image },
    { label: "Blog Posts", href: "/admin/blog", icon: BookOpen },
    { label: "Reviews", href: "/admin/reviews", icon: Star },
  ];

  // Team visible to owner only; Settings visible to all
  const adminNav = [
    ...(isOwner ? [{ label: "Team", href: "/admin/team", icon: UserCog }] : []),
    { label: "Settings", href: "/admin/settings", icon: Settings },
  ];

  const navSection = (items: typeof primaryNav, label?: string) => (
    <div style={{ marginBottom: "8px" }}>
      {label && (
        <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: "#444", padding: "8px 12px 4px" }}>
          {label}
        </p>
      )}
      {items.map(({ label: l, href, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          style={{
            display: "flex", alignItems: "center", gap: "12px",
            padding: "9px 12px", borderRadius: "6px",
            fontFamily: '"Satoshi", sans-serif', fontSize: "14px",
            fontWeight: isActive(href) ? 500 : 400,
            color: isActive(href) ? "#faf5ea" : "#888",
            background: isActive(href) ? "rgba(255,255,255,0.07)" : "transparent",
            transition: "all 0.15s ease", textDecoration: "none",
          }}
        >
          <Icon size={15} strokeWidth={1.5} />
          {l}
        </Link>
      ))}
    </div>
  );

  return (
    <aside style={{
      width: "260px", minHeight: "100vh", background: "#111111",
      borderRight: "1px solid rgba(255,255,255,0.06)",
      display: "flex", flexDirection: "column",
      position: "fixed", top: 0, left: 0, zIndex: 50,
    }}>
      {/* Logo */}
      <div style={{ padding: "28px 24px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <p style={{ fontFamily: '"Clash Display", sans-serif', fontSize: "16px", fontWeight: 500, letterSpacing: "-0.02em", color: "#faf5ea" }}>
          MYKE VISUALS
        </p>
        <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "11px", color: "#444", marginTop: "2px" }}>
          Admin
        </p>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "16px 12px", overflowY: "auto" }}>
        {navSection(primaryNav)}
        {navSection(secondaryNav, isStudioManager ? "Photography" : "Studio")}
        {navSection(contentNav, "Content")}
        {navSection(adminNav, "Admin")}
      </nav>

      {/* Bottom */}
      <div style={{ padding: "12px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <Link href="/" target="_blank" style={{ display: "flex", alignItems: "center", gap: "12px", padding: "9px 12px", borderRadius: "6px", fontFamily: '"Satoshi", sans-serif', fontSize: "13px", color: "#666", textDecoration: "none", marginBottom: "4px" }}>
          <Globe size={15} strokeWidth={1.5} />
          View Site
        </Link>

        <div style={{ padding: "10px 12px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(255,255,255,0.03)", borderRadius: "6px" }}>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "13px", fontWeight: 500, color: "#faf5ea", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {userName}
            </p>
            <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "11px", color: "#ff7738", marginTop: "1px" }}>
              {roleLabel[userRole] || userRole}
            </p>
          </div>
          <button
            onClick={handleLogout}
            title="Sign out"
            style={{ background: "none", border: "none", cursor: "pointer", color: "#555", display: "flex", alignItems: "center", padding: "4px", flexShrink: 0 }}
          >
            <LogOut size={15} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </aside>
  );
}
