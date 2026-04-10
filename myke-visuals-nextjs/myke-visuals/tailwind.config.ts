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
        accent: "#ff7738",
        "accent-hover": "#e8832a",
        cream: "#faf5ea",
        muted: "#bababa",
      },
      fontFamily: {
        display: ["Clash Display", "sans-serif"],
        body: ["Satoshi", "sans-serif"],
        mono: ["Fragment Mono", "monospace"],
      },
      fontSize: {
        hero: ["clamp(66px, 13vw, 157px)", { lineHeight: "0.85", letterSpacing: "-0.06em" }],
        "hero-md": ["clamp(50px, 8vw, 120px)", { lineHeight: "0.85", letterSpacing: "-0.04em" }],
        "section": ["clamp(36px, 5vw, 60px)", { lineHeight: "0.9", letterSpacing: "-0.03em" }],
        "card-title": ["28px", { lineHeight: "1.3", letterSpacing: "-0.01em" }],
        "body-lg": ["38px", { lineHeight: "1.2", letterSpacing: "-0.03em" }],
        "body-sm": ["17px", { lineHeight: "1.5" }],
        "label": ["12px", { lineHeight: "1.5", letterSpacing: "0.02em" }],
      },
      spacing: {
        "nav": "80px",
        "section": "clamp(60px, 10vw, 150px)",
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
