import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['Urbanist', 'system-ui', 'sans-serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#439915",
          foreground: "#FFFFFF",
          hover: "#3a8513",
          active: "#317110",
        },
        secondary: {
          DEFAULT: "#5EC435",
          foreground: "#1A1A1A",
          hover: "#54b02f",
          active: "#4a9c29",
        },
        accent: {
          DEFAULT: "#D2FF28",
          foreground: "#1A1A1A",
          hover: "#bde624",
          active: "#a8cc20",
        },
        success: {
          DEFAULT: "#439915",
          foreground: "#FFFFFF",
        },
        warning: {
          DEFAULT: "#FFA500",
          foreground: "#1A1A1A",
        },
        error: {
          DEFAULT: "#DC2626",
          foreground: "#FFFFFF",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "var(--radius-sm)",
        sm: "calc(var(--radius-sm) - 2px)",
        full: "var(--radius-full)",
      },
      boxShadow: {
        sm: "var(--shadow-sm)",
        hover: "var(--shadow-hover)",
      },
      spacing: {
        card: "var(--padding-card)",
        section: "var(--padding-section)",
        element: "var(--padding-element)",
        avatar: "var(--padding-avatar)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;