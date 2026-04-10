import { MetadataRoute } from "next";
import { getAlbums, getBlogPosts } from "@/lib/queries";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mykevisuals.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [albums, posts] = await Promise.all([getAlbums(), getBlogPosts()]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), priority: 1.0 },
    { url: `${SITE_URL}/about`, lastModified: new Date(), priority: 0.9 },
    { url: `${SITE_URL}/albums`, lastModified: new Date(), priority: 0.9 },
    { url: `${SITE_URL}/studio`, lastModified: new Date(), priority: 0.8 },
    { url: `${SITE_URL}/blog`, lastModified: new Date(), priority: 0.8 },
    { url: `${SITE_URL}/reviews`, lastModified: new Date(), priority: 0.7 },
    { url: `${SITE_URL}/contact`, lastModified: new Date(), priority: 0.8 },
  ];

  const albumPages: MetadataRoute.Sitemap = albums.map((a) => ({
    url: `${SITE_URL}/albums/${a.slug}`,
    lastModified: new Date(a.updated_at),
    priority: 0.7,
  }));

  const blogPages: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${SITE_URL}/blog/${p.slug}`,
    lastModified: new Date(p.updated_at),
    priority: 0.6,
  }));

  return [...staticPages, ...albumPages, ...blogPages];
}
