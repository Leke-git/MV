import type { Metadata } from "next";
import PublicLayout from "@/components/layout/PublicLayout";
import PageHero from "@/components/ui/PageHero";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description:
    "Meet Enekwe Uzoma Michael — professional photographer and visual storyteller behind Myke Visuals, based in Abuja, Nigeria.",
};

const traits = [
  "Creative Vision",
  "Professionalism",
  "Passion",
  "Adaptability",
  "Attention to Detail",
  "Storytelling",
];

const gear = {
  Cameras: ["Sony Alpha a7 IV", "Canon EOS R6 Mark II", "Fujifilm X-T5"],
  Lenses: [
    "Sony FE 85mm f/1.4 GM",
    "Canon RF 50mm f/1.2L USM",
    "Sigma 35mm f/1.4 DG HSM Art",
    "Sony FE 24-70mm f/2.8 GM II",
  ],
  "Lighting & Accessories": [
    "Godox AD300 Pro",
    "Profoto B10 Plus",
    "Godox SL-60W Studio LED",
    "Manfrotto 190XPRO Tripod",
    "DJI RS 3 Gimbal",
    "Peak Design Everyday Backpack 30L",
  ],
  "Editing Tools": [
    "Adobe Lightroom Classic",
    "Adobe Photoshop",
    "Capture One Pro",
    "Wacom Intuos Pro Tablet",
  ],
};

// [README] Replace awards with Myke's real accolades
const awards = [
  { num: "01", name: "Lagos Photo Festival — Featured Photographer", year: "2023" },
  { num: "02", name: "Nigerian Photography Awards — Best Portrait Photographer", year: "2022" },
  { num: "03", name: "Abuja Arts & Culture Recognition Award", year: "2021" },
  { num: "04", name: "Nigerian Photography Awards — Best Wedding Photographer", year: "2020" },
  { num: "05", name: "Creative Industry Summit Abuja — Visual Excellence Award", year: "2019" },
  { num: "06", name: "African Photography Collective — Emerging Talent Recognition", year: "2018" },
];

export default function AboutPage() {
  return (
    <PublicLayout heroPadding>
      {/* Hero */}
      <PageHero
        overline="MYKE VISUALS PHOTOGRAPHY"
        title={["Enekwe", "Michael"]}
        image="/assets/images/about-hero.jpg"
      />

      {/* Intro */}
      <section style={{ background: "var(--color-bg)", padding: "100px 40px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", gap: "80px", alignItems: "flex-start", flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 300px", maxWidth: "600px" }}>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "clamp(18px, 2.5vw, 28px)", fontWeight: 300, lineHeight: 1.5, letterSpacing: "-0.02em", color: "var(--color-text-primary)" }}>
              Hi there! I&apos;m Enekwe Uzoma Michael a.k.a Myke Visuals, professional photographer and visual storyteller based in Abuja, Nigeria. With over five years of experience behind the lens, I specialise in portraits, weddings, fashion editorials, and commercial brand photography. Every frame I take is intentional. Every image is earned.
            </p>
          </div>
          <div style={{ flex: "0 0 auto", display: "flex", gap: "16px" }}>
            {/* [README] Replace these with actual photos of Myke */}
            {["/assets/images/about-1.jpg", "/assets/images/about-2.jpg"].map((src, i) => (
              <div key={i} style={{ width: "200px", aspectRatio: "3/4", position: "relative", overflow: "hidden" }}>
                <Image src={src} alt={`Myke Visuals ${i + 1}`} fill style={{ objectFit: "cover" }} sizes="200px" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section style={{ background: "var(--color-bg)", padding: "0 40px 100px" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "32px" }}>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "clamp(16px, 2vw, 20px)", fontWeight: 300, lineHeight: 1.7, color: "var(--color-text-muted)" }}>
            My relationship with photography started long before it became a career — it started with a fascination for light, people, and the stories hidden in everyday moments. Over the years, that curiosity evolved into a disciplined craft and a thriving creative practice rooted right here in Abuja.
          </p>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "clamp(16px, 2vw, 20px)", fontWeight: 300, lineHeight: 1.7, color: "var(--color-text-muted)" }}>
            I&apos;ve had the privilege of working with incredible clients — from couples on their most important day, to brands building their visual identity from the ground up. Beyond shooting, I founded Myke Studios — Abuja&apos;s premium creative space built for photographers, videographers, content creators, and brands who demand a world-class environment to bring their vision to life.
          </p>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "clamp(16px, 2vw, 20px)", fontWeight: 300, lineHeight: 1.7, color: "var(--color-text-muted)" }}>
            If you&apos;re looking to create something that lasts, I&apos;d love to hear from you.
          </p>
          <Link href="/contact" style={{ display: "inline-block", fontFamily: "var(--font-display)", fontSize: "13px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-bg)", background: "var(--color-text-primary)", padding: "14px 28px", width: "fit-content" }}>
            Book a Session
          </Link>
        </div>
      </section>

      {/* Traits */}
      <section style={{ background: "var(--color-bg-secondary)", padding: "80px 40px", overflow: "hidden" }}>
        <p style={{ fontFamily: "var(--font-display)", fontSize: "14px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-text-muted)", textAlign: "center", marginBottom: "32px" }}>
          What you will find in me
        </p>
        <div style={{ display: "flex", gap: "40px", justifyContent: "center", flexWrap: "wrap" }}>
          {traits.map((t) => (
            <span key={t} style={{ fontFamily: "var(--font-display)", fontSize: "clamp(20px, 3vw, 32px)", fontWeight: 400, letterSpacing: "-0.02em", color: "var(--color-text-primary)", whiteSpace: "nowrap" }}>
              {t}
            </span>
          ))}
        </div>
      </section>

      {/* Awards */}
      <section style={{ background: "var(--color-bg)", padding: "100px 40px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ marginBottom: "60px" }}>
            <p style={{ fontFamily: "var(--font-display)", fontSize: "clamp(16px, 2vw, 20px)", fontWeight: 400, color: "var(--color-text-muted)", marginBottom: "8px" }}>Shining Moments of Glory</p>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 400, letterSpacing: "-0.04em", lineHeight: 1, color: "var(--color-text-primary)" }}>Awards I got</h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {awards.map((a) => (
              <div key={a.num} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px 0", borderTop: "1px solid var(--color-border-subtle)", gap: "20px" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--color-text-muted)", flexShrink: 0 }}>{a.num}</span>
                <p style={{ fontFamily: "var(--font-display)", fontSize: "clamp(16px, 2vw, 22px)", fontWeight: 400, letterSpacing: "-0.01em", color: "var(--color-text-primary)", flex: 1, paddingLeft: "24px" }}>{a.name}</p>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "13px", color: "var(--color-text-muted)", flexShrink: 0 }}>{a.year}</span>
              </div>
            ))}
            <div style={{ borderTop: "1px solid var(--color-border-subtle)" }} />
          </div>
        </div>
      </section>

      {/* Gear */}
      <section style={{ background: "var(--color-bg)", padding: "0 40px 150px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 400, letterSpacing: "-0.04em", lineHeight: 1, color: "var(--color-text-primary)", marginBottom: "60px" }}>Gears I own</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "48px" }}>
            {Object.entries(gear).map(([category, items]) => (
              <div key={category}>
                <p style={{ fontFamily: "var(--font-display)", fontSize: "14px", fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--color-text-muted)", marginBottom: "16px", borderBottom: "1px solid var(--color-border-subtle)", paddingBottom: "8px" }}>{category}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {items.map((item) => (
                    <span key={item} style={{ fontFamily: "var(--font-body)", fontSize: "15px", color: "var(--color-text-primary)" }}>{item}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
