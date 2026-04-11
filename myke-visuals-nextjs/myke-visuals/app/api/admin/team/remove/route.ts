import { NextRequest, NextResponse } from "next/server";
import { createAdminClient, createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  // Auth check
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const adminSupabase = createAdminClient();

  // Only owners can remove users
  const { data: callerProfile } = await adminSupabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (callerProfile?.role !== "owner") {
    return NextResponse.json({ error: "Only owners can remove team members." }, { status: 403 });
  }

  const { userId } = await req.json();
  if (!userId) return NextResponse.json({ error: "userId required." }, { status: 400 });

  // Cannot remove yourself
  if (userId === user.id) {
    return NextResponse.json({ error: "You cannot remove yourself." }, { status: 400 });
  }

  // Cannot remove another owner
  const { data: targetProfile } = await adminSupabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();

  if (targetProfile?.role === "owner") {
    return NextResponse.json({ error: "Cannot remove an owner account." }, { status: 403 });
  }

  // Delete profile row (cascade will handle auth user cleanup via RLS)
  const { error: profileError } = await adminSupabase
    .from("profiles")
    .delete()
    .eq("id", userId);

  if (profileError) {
    console.error("Profile delete error:", profileError);
    return NextResponse.json({ error: "Failed to remove profile." }, { status: 500 });
  }

  // Disable the auth user so they can't log in
  const { error: authError } = await adminSupabase.auth.admin.deleteUser(userId);
  if (authError) {
    console.error("Auth delete error:", authError);
    // Profile is already deleted so access is revoked — log but don't fail
  }

  return NextResponse.json({ success: true });
}
