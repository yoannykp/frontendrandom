import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class", '[data-mode="dark"]'],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ["var(--font-inter)"],
        volkhov: ["var(--font-volkhov)"],
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
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
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        "gray-light": "rgba(171,171,171,0.26)",
        "gray-dark": "#28292c",
        "gray-dark-with-opacity": "#D9D9D912",
        "off-white": "#FFFFFF80",
        glass: "rgba(217, 217, 217, 0.07)",
        positive: "#5FFF95",
        negative: "#FF3F3F",
      },
      borderRadius: {
        normal: "15px",
        "10": "10px",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      spacing: {
        "60": "60px",
        "70": "70px",
      },
      fontSize: {
        "2xs": ["10px", "1.25rem"],
        "12": ["12px", "1rem"],
        xs: ["12px", "1.25rem"],
        sm: ["14px", "1.25rem"],
        base: ["16px", "1.25rem"],
        lg: ["20px", "2rem"],
        "lg-low": ["20px", "1.5rem"],
        xl: ["24px", "1.25rem"],
        "18": ["18px", "1.25rem"],
        "30": ["30px", "2.45rem"],
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        dotLoop: {
          "0%": { content: '"."' },
          "25%": { content: '".."' },
          "50%": { content: '"..."' },
          "75%": { content: '""' },
          "100%": { content: '"."' },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        dotLoop: "dotLoop 1.5s steps(1,end) infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
export default config
