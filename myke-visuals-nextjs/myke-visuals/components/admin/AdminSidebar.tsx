"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard, BookOpen, Image, Star, MessageSquare,
  Calendar, Users, Globe, LogOut, Camera, Package, UserCog, Menu, X,
} from "lucide-react";

interface Props {
  userEmail: string;
  userName: string;
  userRole: string;
}

const SIDEBAR_WIDTH = 260;
const BREAKPOINT = 1024;

export default function AdminSidebar({ userEmail, userName, userRole }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Swipe tracking
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const isOwner = userRole === "owner";
  const isStudioManager = userRole === "studio_manager";

  const roleLabel: Record<string, string> = {
    owner: "Owner",
    studio_manager: "Studio Manager",
    admin: "Admin",
  };

  // Detect mobile/tablet
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < BREAKPOINT);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    if (isMobile) setIsOpen(false);
  }, [pathname, isMobile]);

  // Lock body scroll when sidebar open on mobile
  useEffect(() => {
    if (isMobile && isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isMobile, isOpen]);

  // Swipe to open (from left edge) / swipe to close
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = Math.abs(e.changedTouches[0].clientY - touchStartY.current);
    // Only count horizontal swipes (dx dominates dy)
    if (dy > Math.abs(dx)) return;
    if (dx > 60 && touchStartX.current < 32) setIsOpen(true);  // swipe right from edge
    if (dx < -60 && isOpen) setIsOpen(false);                   // swipe left to close
    touchStartX.current = null;
    touchStartY.current = null;
  }, [isOpen]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  const isActive = (href: string) =>
    pathname === href || (href !== "/admin/dashboard" && pathname.startsWith(href));

  // Nav definitions
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

  const ownerNav = isOwner
    ? [{ label: "Team", href: "/admin/team", icon: UserCog }]
    : [];

  function NavSection({ items, label }: { items: typeof primaryNav; label?: string }) {
    return (
      <div style={{ marginBottom: "4px" }}>
        {label && (
          <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: "#3a3a3a", padding: "12px 12px 4px" }}>
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
              color: isActive(href) ? "#faf5ea" : "#777",
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
  }

  const sidebarContent = (
    <aside style={{
      width: `${SIDEBAR_WIDTH}px`,
      height: "100%",
      background: "#111111",
      borderRight: "1px solid rgba(255,255,255,0.06)",
      display: "flex",
      flexDirection: "column",
      overflowY: "auto",
    }}>
      {/* Logo + close button (mobile) */}
      <div style={{ padding: "24px 24px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <p style={{ fontFamily: '"Clash Display", sans-serif', fontSize: "16px", fontWeight: 500, letterSpacing: "-0.02em", color: "#faf5ea" }}>
            MYKE VISUALS
          </p>
          <p style={{ fontFamily: '"Satoshi", sans-serif', fontSize: "11px", color: "#444", marginTop: "2px" }}>Admin</p>
        </div>
        {isMobile && (
          <button onClick={() => setIsOpen(false)} style={{ background: "none", border: "none", color: "#666", cursor: "pointer", padding: "4px", display: "flex" }}>
            <X size={18} strokeWidth={1.5} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "12px" }}>
        <NavSection items={primaryNav} />
        <NavSection items={secondaryNav} label={isStudioManager ? "Photography" : "Studio"} />
        <NavSection items={contentNav} label="Content" />
        {isOwner && <NavSection items={ownerNav} label="Admin" />}
      </nav>

      {/* Bottom: view site + user identity */}
      <div style={{ padding: "12px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <Link href="/" target="_blank" style={{ display: "flex", alignItems: "center", gap: "12px", padding: "9px 12px", borderRadius: "6px", fontFamily: '"Satoshi", sans-serif', fontSize: "13px", color: "#555", textDecoration: "none", marginBottom: "4px" }}>
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
          <button onClick={handleLogout} title="Sign out" style={{ background: "none", border: "none", cursor: "pointer", color: "#555", display: "flex", padding: "4px", flexShrink: 0 }}>
            <LogOut size={15} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </aside>
  );

  // ── Desktop: fixed sidebar ──────────────────────────────────
  if (!isMobile) {
    return (
      <div style={{ position: "fixed", top: 0, left: 0, height: "100vh", width: `${SIDEBAR_WIDTH}px`, zIndex: 50 }}>
        {sidebarContent}
      </div>
    );
  }

  // ── Mobile: hamburger + drawer + overlay ───────────────────
  return (
    <>
      {/* Touch zone for swipe-from-edge */}
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", zIndex: isOpen ? 49 : 10, pointerEvents: isOpen ? "auto" : "none" }}
      />

      {/* Hamburger button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            position: "fixed", top: "16px", left: "16px", zIndex: 60,
            background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "8px", padding: "10px", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#faf5ea", boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
          }}
        >
          <Menu size={18} strokeWidth={1.5} />
        </button>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
            zIndex: 50, backdropFilter: "blur(2px)",
            animation: "fadeIn 0.2s ease",
          }}
        />
      )}

      {/* Drawer */}
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{
          position: "fixed", top: 0, left: 0, height: "100vh",
          width: `${SIDEBAR_WIDTH}px`, zIndex: 51,
          transform: isOpen ? "translateX(0)" : `translateX(-${SIDEBAR_WIDTH}px)`,
          transition: "transform 0.28s cubic-bezier(0.4, 0, 0.2, 1)",
          willChange: "transform",
        }}
      >
        {sidebarContent}
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
      `}</style>
    </>
  );
}
