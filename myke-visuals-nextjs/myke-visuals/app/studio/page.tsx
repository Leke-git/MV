import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PublicLayout from "@/components/layout/PublicLayout";
import PageHero from "@/components/ui/PageHero";

export const metadata: Metadata = {
  title: "Studio",
  description:
    "Myke Studios — Abuja's premium creative space. Available for hourly hire with professional lighting, cyclorama wall, backdrops, and changing room.",
};

const features = [
  { label: "Cyclorama Wall", desc: "Seamless infinity cove — ideal for full-body portraits, product shoots, and video." },
  { label: "Professional Lighting", desc: "Godox and Profoto strobes, continuous LED panels, and modifiers included in every booking." },
  { label: "Backdrops", desc: "Multiple coloured and textured backdrops available — matte, seamless paper, and fabric." },
  { label: "Changing Room", desc: "Private changing area with mirror for talent, models, and clients." },
  { label: "Equipment Rental", desc: "Cameras, lenses, and accessories available as add-ons — no full booking required." },
  { label: "High-Speed WiFi", desc: "Tethering-ready connection for live view and instant client review on set." },
];

const useCases = [
  "Portrait & Headshot Sessions",
  "Fashion & Editorial Shoots",
  "Product & Commercial Photography",
  "Video & Content Creation",
  "Podcast & Interview Recording",
  "Brand Campaign Production",
];

export default function StudioPage() {
  return (
    <PublicLayout heroPadding>
      {/* Hero */}
      <PageHero
        overline="MYKE VISUALS — ABUJA'S CREATIVE SPACE"
        title={["Myke", "Studios"]}
        image="/assets/images/studio-hero.jpg"
      />

      {/* Intro */}
      <section style={{ background: "var(--color-bg)", padding: "100px 40px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", gap: "80px", alignItems: "flex-start", flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 400px" }}>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--color-accent)", marginBottom: "20px" }}>
              THE SPACE
            </p>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "clamp(18px, 2.5vw, 28px)", fontWeight: 300, lineHeight: 1.5, letterSpacing: "-0.02em", color: "var(--color-text-primary)" }}>
              Myke Studios is Abuja&apos;s premium creative space, founded by Enekwe Uzoma Michael — professional photographer and visual storyteller with over five years of experience. Built for photographers, videographers, content creators, and brands who refuse to compromise on quality.
            </p>
          </div>
          <div style={{ flex: "1 1 300px" }}>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "16px", fontWeight: 300, color: "var(--color-text-muted)", lineHeight: 1.8, marginBottom: "24px" }}>
              The idea for Myke Studios didn&apos;t start with a business plan — it started with a problem. As a working photographer in Abuja, finding a truly world-class creative space was a constant challenge. So we built one.
            </p>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "16px", fontWeight: 300, color: "var(--color-text-muted)", lineHeight: 1.8 }}>
              Inside, you&apos;ll find everything you need to walk in and create at the highest level. Available independently of booking Myke as your photographer.
            </p>
          </div>
        </div>
      </section>

      {/* Studio images */}
      <section style={{ background: "var(--color-bg)", padding: "0 40px 100px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
          {/* [README] Replace with actual studio photos */}
          {[
            "/assets/images/studio-1.jpg",
            "/assets/images/studio-2.jpg",
            "/assets/images/studio-3.jpg",
          ].map((src, i) => (
            <div key={i} style={{ position: "relative", aspectRatio: "4/5", overflow: "hidden" }}>
              <Image src={src} alt={`Myke Studios ${i + 1}`} fill style={{ objectFit: "cover" }} sizes="33vw" />
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{ background: "var(--color-bg-secondary)", padding: "100px 40px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ marginBottom: "60px" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 400, letterSpacing: "-0.04em", lineHeight: 1, color: "var(--color-text-primary)" }}>
              What&apos;s Included
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1px", background: "var(--color-border-subtle)" }}>
            {features.map((f) => (
              <div key={f.label} style={{ background: "var(--color-bg-secondary)", padding: "40px 32px" }}>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "20px", fontWeight: 400, letterSpacing: "-0.01em", color: "var(--color-text-primary)", marginBottom: "12px" }}>
                  {f.label}
                </h3>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "15px", fontWeight: 300, color: "var(--color-text-muted)", lineHeight: 1.6 }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section style={{ background: "var(--color-bg)", padding: "100px 40px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", gap: "80px", alignItems: "flex-start", flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 300px" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 400, letterSpacing: "-0.04em", lineHeight: 1, color: "var(--color-text-primary)" }}>
              Who&apos;s It For
            </h2>
          </div>
          <div style={{ flex: "1 1 400px", display: "flex", flexDirection: "column" }}>
            {useCases.map((uc, i) => (
              <div key={uc} style={{ display: "flex", alignItems: "center", gap: "20px", padding: "20px 0", borderTop: "1px solid var(--color-border-subtle)" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--color-text-muted)" }}>{String(i + 1).padStart(2, "0")}</span>
                <span style={{ fontFamily: "var(--font-display)", fontSize: "clamp(16px, 2vw, 22px)", fontWeight: 400, letterSpacing: "-0.01em", color: "var(--color-text-primary)" }}>{uc}</span>
              </div>
            ))}
            <div style={{ borderTop: "1px solid var(--color-border-subtle)" }} />
          </div>
        </div>
      </section>

      {/* Equipment rental section */}
      <section id="equipment" style={{ background: "var(--color-bg-secondary)", padding: "100px 40px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", gap: "60px", alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ flex: "0 0 auto", width: "clamp(200px, 35%, 400px)", aspectRatio: "4/3", position: "relative", overflow: "hidden" }}>
            {/* [README] Replace with actual equipment photo */}
            <Image src="/assets/images/equipment-rental.jpg" alt="Equipment Rental" fill style={{ objectFit: "cover" }} sizes="35vw" />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--color-accent)", marginBottom: "16px" }}>ADD-ON</p>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 400, letterSpacing: "-0.04em", lineHeight: 1, color: "var(--color-text-primary)", marginBottom: "24px" }}>
              Equipment Rental
            </h2>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "16px", fontWeight: 300, color: "var(--color-text-muted)", lineHeight: 1.7, marginBottom: "32px" }}>
              Need gear without the full studio booking? Cameras, lenses, lighting equipment, and accessories are available to rent separately. Ideal for photographers who have their own space but need top-tier kit.
            </p>
            <Link href="/contact" style={{ display: "inline-block", fontFamily: "var(--font-display)", fontSize: "13px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-bg)", background: "var(--color-text-primary)", padding: "14px 28px" }}>
              Enquire About Rental
            </Link>
          </div>
        </div>
      </section>

      {/* Booking CTA */}
      <section style={{ background: "var(--color-accent)", padding: "100px 40px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "40px" }}>
          <div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(32px, 5vw, 64px)", fontWeight: 400, letterSpacing: "-0.04em", lineHeight: 1, color: "var(--color-bg)", marginBottom: "16px" }}>
              Ready to Create?
            </h2>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "16px", fontWeight: 300, color: "rgba(10,10,10,0.7)", lineHeight: 1.5 }}>
              Book Myke Visuals Studio by the hour. Whether you&apos;re shooting a campaign,<br />filming content, or building your brand — this is where Abuja&apos;s best work happens.
            </p>
          </div>
          <Link href="/contact" style={{ display: "inline-block", fontFamily: "var(--font-display)", fontSize: "13px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-text-primary)", background: "var(--color-bg)", padding: "18px 40px", whiteSpace: "nowrap" }}>
            Book the Studio
          </Link>
        </div>
      </section>

      <style>{`
        @media (max-width: 809px) {
          section > div > div[style*="grid-template-columns: repeat(3"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </PublicLayout>
  );
}
