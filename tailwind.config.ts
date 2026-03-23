import type { Config } from "tailwindcss";

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
        display: ["Nunito Sans", "sans-serif"],
      },
      fontSize: {
        "display-lg": ["57px", { lineHeight: "64px" }],
        "display-md": ["45px", { lineHeight: "52px" }],
        "display-sm": ["36px", { lineHeight: "44px" }],
        "headline-lg": ["32px", { lineHeight: "40px" }],
        "headline-md": ["28px", { lineHeight: "36px" }],
        "headline-sm": ["24px", { lineHeight: "32px" }],
        "title-lg": ["22px", { lineHeight: "28px" }],
        "title-md": ["16px", { lineHeight: "24px" }],
        "title-sm": ["14px", { lineHeight: "20px" }],
        "body-lg": ["16px", { lineHeight: "24px" }],
        "body-md": ["14px", { lineHeight: "20px" }],
        "body-sm": ["12px", { lineHeight: "16px" }],
        "label-lg": ["14px", { lineHeight: "20px" }],
        "label-md": ["12px", { lineHeight: "16px" }],
        "label-sm": ["11px", { lineHeight: "16px" }],
      },
      colors: {
        /* ── Light ─────────────────────────── */
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        "primary-container": {
          DEFAULT: "hsl(var(--primary-container))",
          foreground: "hsl(var(--on-primary-container))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        "secondary-container": {
          DEFAULT: "hsl(var(--secondary-container))",
          foreground: "hsl(var(--on-secondary-container))",
        },
        tertiary: {
          DEFAULT: "hsl(var(--tertiary))",
          foreground: "hsl(var(--tertiary-foreground))",
        },
        "tertiary-container": {
          DEFAULT: "hsl(var(--tertiary-container))",
          foreground: "hsl(var(--on-tertiary-container))",
        },
        error: {
          DEFAULT: "hsl(var(--error))",
          foreground: "hsl(var(--error-foreground))",
        },
        "error-container": {
          DEFAULT: "hsl(var(--error-container))",
          foreground: "hsl(var(--on-error-container))",
        },
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        surface: {
          DEFAULT: "hsl(var(--surface))",
          foreground: "hsl(var(--on-surface))",
          variant: "hsl(var(--surface-variant))",
          "variant-foreground": "hsl(var(--on-surface-variant))",
          dim: "hsl(var(--surface-dim))",
          bright: "hsl(var(--surface-bright))",
          "container-lowest": "hsl(var(--surface-container-lowest))",
          "container-low": "hsl(var(--surface-container-low))",
          container: "hsl(var(--surface-container))",
          "container-high": "hsl(var(--surface-container-high))",
          "container-highest": "hsl(var(--surface-container-highest))",
        },
        outline: {
          DEFAULT: "hsl(var(--outline))",
          variant: "hsl(var(--outline-variant))",
        },
        scrim: "hsl(var(--scrim))",
        "inverse-surface": {
          DEFAULT: "hsl(var(--inverse-surface))",
          foreground: "hsl(var(--inverse-on-surface))",
        },
        "inverse-primary": "hsl(var(--inverse-primary))",
        /* ShadCN aliases */
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
};

export default config;
