export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import AlbumEditor from "@/components/admin/AlbumEditor";
import type { Album } from "@/types";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Edit Album — Admin" };

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditAlbumPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("albums")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) notFound();

  return <AlbumEditor album={data as Album} />;
}
