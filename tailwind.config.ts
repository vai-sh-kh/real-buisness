import type { Config } from "tailwindcss";

/**
 * Admin panel responsive breakpoints (Tailwind defaults):
 * - default: mobile-first (< 640px)
 * - sm: 640px (larger phones / small tablets)
 * - md: 768px (optional intermediate layouts)
 * - lg: 1024px (admin layout switch: sidebar vs bottom nav, sheet side)
 */

const config: Config = {
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    fontFamily: {
      heading: ["var(--font-heading)", "Lora", "serif"],
    },
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        "admin-sans": ["var(--admin-font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      height: {
        "admin-app-bar": "var(--admin-app-bar-height)",
        "admin-bottom-nav": "var(--admin-bottom-nav-height)",
      },
      spacing: {
        "safe-top": "env(safe-area-inset-top)",
        "safe-bottom": "env(safe-area-inset-bottom)",
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        gold: {
          DEFAULT: "hsl(var(--gold))",
          foreground: "hsl(var(--gold-foreground))",
        },
        "brand-gold": {
          DEFAULT: "hsl(var(--brand-gold))",
          foreground: "hsl(var(--brand-gold-foreground))",
        },
        "brand-blue": {
          DEFAULT: "hsl(var(--brand-blue))",
          foreground: "hsl(var(--brand-blue-foreground))",
        },
        "brand-charcoal": "#1A1A1A",
        "brand-orange": "hsl(var(--brand-orange))",
        "brand-orange-muted": "hsl(var(--brand-orange-muted))",
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        /* Admin panel - only used inside #admin-theme-root */
        "admin-sidebar": {
          bg: "hsl(var(--admin-sidebar-bg))",
          border: "hsl(var(--admin-sidebar-border))",
          text: "hsl(var(--admin-sidebar-text))",
          "text-muted": "hsl(var(--admin-sidebar-text-muted))",
          hover: "hsl(var(--admin-sidebar-hover))",
          active: "hsl(var(--admin-sidebar-active))",
          "active-indicator": "hsl(var(--admin-sidebar-active-indicator))",
        },
        "admin-header": {
          bg: "hsl(var(--admin-header-bg))",
          border: "hsl(var(--admin-header-border))",
        },
        "admin-main": {
          bg: "hsl(var(--admin-main-bg))",
        },
        "admin-card": {
          bg: "hsl(var(--admin-card-bg))",
          border: "hsl(var(--admin-card-border))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        marquee: "marquee 20s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
