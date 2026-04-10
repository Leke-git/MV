export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers();
  const pathname = headersList.get("x-invoke-path") || headersList.get("x-pathname") || "";

  // Don't run auth check on the login page itself — prevents redirect loop
  const isLoginPage = pathname.includes("/admin/login");

  if (!isLoginPage) {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect("/admin/login");

    return (
      <div style={{ display: "flex", minHeight: "100vh", background: "#0d0d0d" }}>
        <AdminSidebar userEmail={user.email || ""} />
        <main style={{ flex: 1, overflow: "auto", padding: "40px", marginLeft: "260px" }}>
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

  // Login page renders without sidebar or auth check
  return <>{children}</>;
}
