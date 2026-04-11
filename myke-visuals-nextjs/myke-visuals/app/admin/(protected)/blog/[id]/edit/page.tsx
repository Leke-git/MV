export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import BlogEditor from "@/components/admin/BlogEditor";
import type { BlogPost } from "@/types";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Edit Post — Admin" };

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditBlogPostPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from("blog_posts").select("*").eq("id", id).single();

  if (error || !data) notFound();

  return <BlogEditor post={data as BlogPost} />;
}
