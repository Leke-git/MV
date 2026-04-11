import BlogEditor from "@/components/admin/BlogEditor";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "New Post — Admin" };

export default function NewBlogPostPage() {
  return <BlogEditor />;
}
