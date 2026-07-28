import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/hooks/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta principal de marca: negro / blanco / azul electrico.
        brand: {
          black: "#0A0A0B",
          "black-soft": "#141416",
          white: "#FFFFFF",
          "off-white": "#F5F6F8",
          blue: "#0066FF",
          "blue-light": "#3D8BFF",
          "blue-dark": "#0047B3",
          gray: {
            100: "#F5F6F8",
            200: "#E7E9EC",
            300: "#D3D6DB",
            400: "#9AA0A8",
            500: "#6B7178",
            600: "#4B4F55",
            700: "#2E3136",
            800: "#1C1E21",
            900: "#0A0A0B",
          },
        },
      },
      fontFamily: {
        sans: [
          "var(--font-sans)",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      boxShadow: {
        premium: "0 8px 40px -8px rgba(0, 0, 0, 0.15)",
        "premium-lg": "0 20px 60px -12px rgba(0, 0, 0, 0.25)",
        glow: "0 0 40px -8px rgba(0, 102, 255, 0.45)",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "fade-up": "fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-in": "fadeIn 0.5s ease-out forwards",
        shimmer: "shimmer 2s linear infinite",
      },
      transitionTimingFunction: {
        premium: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      maxWidth: {
        "8xl": "90rem",
      },
    },
  },
  plugins: [],
};

export default config;
