import { createServerSupabaseClient } from "./supabase/server";
import type { Album, BlogPost, Review } from "@/types";

// ============================================================
// ALBUMS
// ============================================================

export async function getAlbums(): Promise<Album[]> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("albums")
    .select("*")
    .eq("published", true)
    .order("year", { ascending: false });

  if (error) { console.error("getAlbums error:", error); return []; }
  return data as Album[];
}

export async function getAlbumBySlug(slug: string): Promise<Album | null> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("albums")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (error) { console.error("getAlbumBySlug error:", error); return null; }
  return data as Album;
}

// ============================================================
// BLOG
// ============================================================

export async function getBlogPosts(limit?: number): Promise<BlogPost[]> {
  const supabase = await createServerSupabaseClient();
  let query = supabase
    .from("blog_posts")
    .select("*")
    .eq("published", true)
    .order("published_at", { ascending: false });

  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error) { console.error("getBlogPosts error:", error); return []; }
  return data as BlogPost[];
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (error) { console.error("getBlogPostBySlug error:", error); return null; }
  return data as BlogPost;
}

export async function getFeaturedBlogPosts(): Promise<BlogPost[]> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("published", true)
    .eq("featured", true)
    .order("published_at", { ascending: false })
    .limit(3);

  if (error) { console.error("getFeaturedBlogPosts error:", error); return []; }
  return data as BlogPost[];
}

// ============================================================
// REVIEWS
// ============================================================

export async function getReviews(): Promise<Review[]> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("approved", true)
    .order("created_at", { ascending: false });

  if (error) { console.error("getReviews error:", error); return []; }
  return data as Review[];
}
