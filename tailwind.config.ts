import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#09090b",
        foreground: "#f4f4f5",
        card: {
          DEFAULT: "#121215",
          foreground: "#f4f4f5",
          hover: "#18181b",
        },
        popover: {
          DEFAULT: "#121215",
          foreground: "#f4f4f5",
        },
        primary: {
          DEFAULT: "#fafafa",
          foreground: "#09090b",
        },
        secondary: {
          DEFAULT: "#27272a",
          foreground: "#fafafa",
        },
        muted: {
          DEFAULT: "#27272a",
          foreground: "#a1a1aa",
        },
        accent: {
          DEFAULT: "#27272a",
          foreground: "#fafafa",
        },
        destructive: {
          DEFAULT: "#7f1d1d",
          foreground: "#fef2f2",
        },
        border: "#27272a",
        input: "#27272a",
        ring: "#d4d4d8",
        brand: {
          DEFAULT: "#3b82f6",
          dark: "#1d4ed8",
        },
      },
      fontFamily: {
        mono: ["Geist Mono", "JetBrains Mono", "Menlo", "monospace"],
        sans: ["Geist", "Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
