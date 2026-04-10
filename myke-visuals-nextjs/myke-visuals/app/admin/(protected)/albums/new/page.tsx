import AlbumEditor from "@/components/admin/AlbumEditor";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "New Album — Admin" };

export default function NewAlbumPage() {
  return <AlbumEditor />;
}
