export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .single();

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0d0d0d" }}>
      <AdminSidebar
        userEmail={user.email || ""}
        userName={profile?.full_name || user.email || ""}
        userRole={profile?.role || "admin"}
      />
      <main id="admin-main" style={{ flex: 1, overflow: "auto", padding: "40px", marginLeft: "260px" }}>
        {children}
      </main>
      <style>{`
        @media (max-width: 1024px) {
          #admin-main { margin-left: 0 !important; padding: 20px !important; }
        }
      `}</style>
    </div>
  );
}
