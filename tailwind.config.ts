import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        orthostep: {
          DEFAULT: "#1f7d4a",
          light: "#d9f2e0",
          dark: "#0f4f2e"
        }
      },
      boxShadow: {
        soft: "0 18px 50px rgba(15, 47, 46, 0.08)"
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"]
      },
      animation: {
        float: "float 6s ease-in-out infinite"
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" }
        }
      }
    }
  },
  plugins: []
};

export default config;
