import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        zodiac: {
          // Brand Colors จาก CI
          red: "#FF1E27",
          gold: "#FFB800",
          
          // Dark Surfaces
          bg: "#0A0D14",
          card: "#121722",
          cardHover: "#1A2232",
          border: "rgba(255, 255, 255, 0.08)",
          borderRed: "rgba(255, 30, 39, 0.3)",
          
          // Status Colors
          win: "#10B981",
          loss: "#EF4444",
          muted: "#8E9BAE",
        },
      },
    },
  },
  plugins: [],
};
export default config;