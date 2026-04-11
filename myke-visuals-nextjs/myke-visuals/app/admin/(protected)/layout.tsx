export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import AdminSidebar from "@/components/admin/AdminSidebar";

// This layout wraps ALL pages under /admin/(protected)/
// If the user is not authenticated they are sent to /admin/login immediately.
// The login page is NOT inside this group so it never hits this layout.

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0d0d0d" }}>
      <AdminSidebar userEmail={user.email || ""} />
      <main
        style={{
          flex: 1,
          overflow: "auto",
          padding: "40px",
          marginLeft: "260px",
        }}
      >
        {children}
      </main>
      <style>{`
        @media (max-width: 1024px) {
          main { margin-left: 0 !important; padding: 20px !important; }
        }
      `}</style>
    </div>
  );
}
