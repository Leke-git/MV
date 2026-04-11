import { NextRequest, NextResponse } from "next/server";
import { createAdminClient, createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  // Auth check — must be owner
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const adminSupabase = createAdminClient();

  // Check caller is owner
  const { data: callerProfile } = await adminSupabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!callerProfile || !["owner", "admin"].includes(callerProfile.role)) {
    return NextResponse.json({ error: "Only owners and admins can invite team members." }, { status: 403 });
  }

  const { email, full_name, role } = await req.json();

  if (!email || !full_name || !role) {
    return NextResponse.json({ error: "email, full_name, and role are required." }, { status: 400 });
  }

  // Owners can invite admin and studio_manager
  // Admins can only invite studio_manager
  const allowedRoles = callerProfile.role === "owner"
    ? ["admin", "studio_manager"]
    : ["studio_manager"];

  if (!allowedRoles.includes(role)) {
    return NextResponse.json({ error: "You don't have permission to assign this role." }, { status: 403 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mykevisuals.com";

  // Invite the user via Supabase Auth (sends a magic link / invite email)
  const { data: inviteData, error: inviteError } = await adminSupabase.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${siteUrl}/admin/login`,
    data: { full_name, role },
  });

  if (inviteError) {
    console.error("Invite error:", inviteError);
    return NextResponse.json({ error: inviteError.message }, { status: 500 });
  }

  // Create profile row for the invited user
  if (inviteData.user) {
    const { error: profileError } = await adminSupabase.from("profiles").upsert({
      id: inviteData.user.id,
      full_name,
      role,
    });

    if (profileError) {
      console.error("Profile creation error:", profileError);
      // Don't fail — the auth invite was sent, profile can be created on first login
    }
  }

  return NextResponse.json({ success: true });
}
