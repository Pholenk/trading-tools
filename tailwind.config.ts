import type { Config } from "tailwindcss";

/**
 * tailwind.config.ts
 *
 * In Tailwind v4 all color tokens are registered via `@theme inline` in
 * globals.css. This config is kept for content scanning, font family, font
 * size, and border-radius tokens only.
 */
const config: Config = {
  darkMode: ["class", "[data-theme='dark']"] as const,
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Nunito Sans", "sans-serif"],
      },
      fontSize: {
        "display-lg":   ["57px", { lineHeight: "64px" }],
        "display-md":   ["45px", { lineHeight: "52px" }],
        "display-sm":   ["36px", { lineHeight: "44px" }],
        "headline-lg":  ["32px", { lineHeight: "40px" }],
        "headline-md":  ["28px", { lineHeight: "36px" }],
        "headline-sm":  ["24px", { lineHeight: "32px" }],
        "title-lg":     ["22px", { lineHeight: "28px" }],
        "title-md":     ["16px", { lineHeight: "24px" }],
        "title-sm":     ["14px", { lineHeight: "20px" }],
        "body-lg":      ["16px", { lineHeight: "24px" }],
        "body-md":      ["14px", { lineHeight: "20px" }],
        "body-sm":      ["12px", { lineHeight: "16px" }],
        "label-lg":     ["14px", { lineHeight: "20px" }],
        "label-md":     ["12px", { lineHeight: "16px" }],
        "label-sm":     ["11px", { lineHeight: "16px" }],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      spacing: {
        "13": "3.25rem",
        "18": "4.5rem"
      }
    },
  },
  plugins: [],
};

export default config;
