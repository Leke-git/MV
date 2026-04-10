"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard,
  BookOpen,
  Image,
  Star,
  MessageSquare,
  Calendar,
  Users,
  Settings,
  LogOut,
  Globe,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Blog Posts", href: "/admin/blog", icon: BookOpen },
  { label: "Albums", href: "/admin/albums", icon: Image },
  { label: "Reviews", href: "/admin/reviews", icon: Star },
  { label: "Enquiries", href: "/admin/enquiries", icon: MessageSquare },
  { label: "Bookings", href: "/admin/bookings", icon: Calendar },
  { label: "Clients", href: "/admin/clients", icon: Users },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

interface Props {
  userEmail: string;
}

export default function AdminSidebar({ userEmail }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  const isActive = (href: string) =>
    pathname === href || (href !== "/admin/dashboard" && pathname.startsWith(href));

  return (
    <aside
      style={{
        width: "260px",
        minHeight: "100vh",
        background: "#111111",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 50,
      }}
    >
      {/* Logo */}
      <div style={{ padding: "32px 24px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <p style={{ fontFamily: '"Clash Display", sans-serif', fontSize: "16px", fontWeight: 500, letterSpacing: "-0.02em", color: "#faf5ea" }}>
          MYKE VISUALS
        </p>
        <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "12px", color: "#bababa", marginTop: "2px" }}>
          Admin Dashboard
        </p>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: "2px" }}>
        {navItems.map(({ label, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "10px 12px",
              borderRadius: "6px",
              fontFamily: '"Satoshi", sans-serif',
              fontSize: "14px",
              fontWeight: isActive(href) ? 500 : 400,
              color: isActive(href) ? "#faf5ea" : "#bababa",
              background: isActive(href) ? "rgba(255,255,255,0.07)" : "transparent",
              transition: "all 0.15s ease",
              textDecoration: "none",
            }}
          >
            <Icon size={16} strokeWidth={1.5} />
            {label}
          </Link>
        ))}
      </nav>

      {/* Bottom */}
      <div style={{ padding: "16px 12px", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", gap: "8px" }}>
        {/* View site */}
        <Link
          href="/"
          target="_blank"
          style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 12px", borderRadius: "6px", fontFamily: '"Satoshi", sans-serif', fontSize: "14px", color: "#bababa", textDecoration: "none" }}
        >
          <Globe size={16} strokeWidth={1.5} />
          View Site
        </Link>

        {/* User + logout */}
        <div style={{ padding: "10px 12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "12px", color: "#faf5ea", maxWidth: "160px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {userEmail}
            </p>
          </div>
          <button
            onClick={handleLogout}
            title="Sign out"
            style={{ background: "none", border: "none", cursor: "pointer", color: "#bababa", display: "flex", alignItems: "center", padding: "4px" }}
          >
            <LogOut size={16} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </aside>
  );
}
