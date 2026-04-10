import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mykevisuals.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Myke Visuals — Abuja Wedding & Portrait Photographer",
    template: "%s | Myke Visuals",
  },
  description:
    "Professional photographer and visual storyteller based in Abuja, Nigeria. Specialising in portraits, weddings, fashion editorials, and commercial brand photography.",
  keywords: ["Abuja photographer", "wedding photographer Abuja", "portrait photographer Nigeria", "Myke Visuals"],
  authors: [{ name: "Enekwe Uzoma Michael" }],
  creator: "Myke Visuals",
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: SITE_URL,
    siteName: "Myke Visuals",
    title: "Myke Visuals — Abuja Wedding & Portrait Photographer",
    description: "Professional photographer and visual storyteller based in Abuja, Nigeria.",
    images: [{ url: "/assets/images/og-image.jpg", width: 1200, height: 630, alt: "Myke Visuals" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Myke Visuals — Abuja Wedding & Portrait Photographer",
    description: "Professional photographer and visual storyteller based in Abuja, Nigeria.",
    images: ["/assets/images/og-image.jpg"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        {children}
        {GA_ID && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
            <Script id="google-analytics" strategy="afterInteractive">{`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}', { page_path: window.location.pathname });
            `}</Script>
          </>
        )}
      </body>
    </html>
  );
}
