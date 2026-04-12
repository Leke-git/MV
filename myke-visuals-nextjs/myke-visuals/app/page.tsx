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
      {/*
        Hero + Stats share a stacking context.
        Hero is sticky so the image stays in view while Stats scroll over it.
        Stats have a semi-transparent background so the hero bleeds through.
      */}
      <div style={{ position: "relative" }}>
        {/* Hero sticks while stats pass over it */}
        <div style={{ position: "sticky", top: 0, zIndex: 0 }}>
          <HeroSection />
        </div>
        {/* Stats scroll over the sticky hero */}
        <div style={{ position: "relative", zIndex: 1, marginTop: "-100vh" }}>
          {/* Spacer so stats start below the fold */}
          <div style={{ height: "100vh" }} />
          <StatsSection />
        </div>
      </div>

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
