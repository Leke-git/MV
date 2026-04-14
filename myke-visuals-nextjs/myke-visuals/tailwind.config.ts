import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0a0a0a",
        "bg-secondary": "#111111",
        accent: "#e05c00",
        "accent-light": "#ff8534",
        "accent-hover": "#c45200",
        cream: "#faf0e0",
        muted: "rgba(250,240,224,0.65)",
      },
      fontFamily: {
        display: ["Clash Display", "sans-serif"],
        body: ["Satoshi", "sans-serif"],
        mono: ["Fragment Mono", "monospace"],
      },
      fontSize: {
        // Framer style guide: H1 157px/80, H1b 66px/90, H2 120px/80, H2-S 26px/1.2
        // H3 28px/1.3, H3-S 20px/1.3, H4 20px/120, Body1 12px/150
        // Body2 40px/150, Body3 22px/150, Para-L 38px/1.2, Para 17px/150
        // NavMenu 96px/0.8, FooterNav 15px/150, FooterText 240px/1.0
        hero: ["clamp(66px, 13vw, 157px)", { lineHeight: "0.80", letterSpacing: "-0.06em" }],
        "hero-b": ["clamp(48px, 6vw, 66px)", { lineHeight: "0.90", letterSpacing: "-0.04em" }],
        "hero-md": ["clamp(50px, 8vw, 120px)", { lineHeight: "0.80", letterSpacing: "-0.04em" }],
        section: ["clamp(36px, 5vw, 60px)", { lineHeight: "0.9", letterSpacing: "-0.03em" }],
        "card-title": ["28px", { lineHeight: "1.3", letterSpacing: "-0.01em" }],
        "body-xl": ["40px", { lineHeight: "1.5", letterSpacing: "-0.02em" }],
        "body-lg": ["38px", { lineHeight: "1.2", letterSpacing: "-0.03em" }],
        "body-md": ["22px", { lineHeight: "1.5", letterSpacing: "-0.01em" }],
        "body-sm": ["17px", { lineHeight: "1.5" }],
        "body-xs": ["12px", { lineHeight: "1.5" }],
        "nav-menu": ["clamp(52px, 8vw, 96px)", { lineHeight: "0.8" }],
        "footer-text": ["clamp(100px, 18vw, 240px)", { lineHeight: "1.0", letterSpacing: "-0.05em" }],
        label: ["12px", { lineHeight: "1.5", letterSpacing: "0.04em" }],
      },
      spacing: {
        nav: "80px",
        section: "clamp(60px, 10vw, 150px)",
      },
      borderColor: {
        subtle: "rgba(255,255,255,0.1)",
        mid: "rgba(255,255,255,0.3)",
      },
      backgroundColor: {
        surface: "rgba(255,255,255,0.05)",
      },
      screens: {
        tablet: "810px",
        desktop: "1200px",
      },
    },
  },
  plugins: [],
};

export default config;
