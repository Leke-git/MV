import type { Metadata } from "next";
import PublicLayout from "@/components/layout/PublicLayout";
import ContactForm from "@/components/forms/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Myke Visuals — book a portrait, wedding, or brand photography session in Abuja, Nigeria.",
};

export default function ContactPage() {
  return (
    <PublicLayout>
      <section style={{ background: "var(--color-bg)", padding: "120px 40px 150px", minHeight: "100vh" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", gap: "100px", alignItems: "flex-start", flexWrap: "wrap" }}>
          {/* Left */}
          <div style={{ flex: "1 1 300px", maxWidth: "420px" }}>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--color-accent)", marginBottom: "20px" }}>
              GET IN TOUCH
            </p>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(40px, 7vw, 80px)", fontWeight: 400, letterSpacing: "-0.05em", lineHeight: 0.9, color: "var(--color-text-primary)", marginBottom: "40px" }}>
              Let&apos;s
              <br />
              Talk
            </h1>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "16px", fontWeight: 300, color: "var(--color-text-muted)", lineHeight: 1.7, marginBottom: "40px" }}>
              Ready to create something extraordinary? Whether it&apos;s a portrait session, your wedding day, a brand campaign, or studio hire — get in touch and let&apos;s make it happen.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <a href="mailto:info@mykevisuals.com" style={{ fontFamily: "var(--font-body)", fontSize: "15px", color: "var(--color-text-primary)", display: "flex", alignItems: "center", gap: "8px" }}>
                {/* [README] Update with Myke's actual email */}
                info@mykevisuals.com
              </a>
              <a href="https://wa.me/message/OTYCTLJLVBSWN1" target="_blank" rel="noopener noreferrer" style={{ fontFamily: "var(--font-body)", fontSize: "15px", color: "var(--color-text-primary)" }}>
                WhatsApp
              </a>
              <a href="https://www.instagram.com/mykevisuals/" target="_blank" rel="noopener noreferrer" style={{ fontFamily: "var(--font-body)", fontSize: "15px", color: "var(--color-text-primary)" }}>
                @mykevisuals
              </a>
            </div>
          </div>

          {/* Right - Form */}
          <div style={{ flex: "1 1 400px" }}>
            <ContactForm />
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
