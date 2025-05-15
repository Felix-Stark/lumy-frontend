import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}", // scan Vue components and TS/JS files
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        serif: ["Merriweather", "serif"],
      },
      colors: {
        primary: {
          DEFAULT: "#2563eb", // blue-600
          light: "#3b82f6", // blue-500
          dark: "#1e40af", // blue-800
        },
        purple: {
          DEFAULT: "605BFF",
        },
        gray: {
          DEFAULT: "#6b7280", // gray-600
          light: "#EFEFF9",
        },
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },
      boxShadow: {
        card: "0 4px 12px rgba(0, 0, 0, 0.05)",
      },
    },
  },
  plugins: [],
};
export default config;
