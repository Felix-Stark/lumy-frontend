import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}", // scan Vue components and TS/JS files
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter Variable", "sans-serif"],
        serif: ["Merriweather", "serif"],
      },
      colors: {

        gray: {
          DEFAULT: "#6b7280", // gray-600
          light: "#EFEFF9",
        },
      },
    },
  },
  plugins: [],
};
export default config;
