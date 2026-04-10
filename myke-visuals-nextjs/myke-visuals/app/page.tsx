import PublicLayout from "@/components/layout/PublicLayout";
import HeroSection from "@/components/sections/HeroSection";
import StatsSection from "@/components/sections/StatsSection";
import AboutSection from "@/components/sections/AboutSection";
import AlbumsSection from "@/components/sections/AlbumsSection";
import ServicesSection from "@/components/sections/ServicesSection";
import ExtraServicesSection from "@/components/sections/ExtraServicesSection";
import ReviewsSection from "@/components/sections/ReviewsSection";
import BlogSection from "@/components/sections/BlogSection";
import FAQSection from "@/components/sections/FAQSection";
import { getAlbums, getBlogPosts, getReviews } from "@/lib/queries";

export default async function HomePage() {
  const [albums, posts, reviews] = await Promise.all([
    getAlbums(),
    getBlogPosts(3),
    getReviews(),
  ]);

  return (
    <PublicLayout>
      <HeroSection />
      <StatsSection />
      <AboutSection />
      <AlbumsSection albums={albums} />
      <ServicesSection />
      <ExtraServicesSection />
      <ReviewsSection reviews={reviews} />
      <BlogSection posts={posts} />
      <FAQSection />
    </PublicLayout>
  );
}
