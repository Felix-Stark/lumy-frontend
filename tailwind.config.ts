/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        mypurple: {
          DEFAULT: "--color-var(#962DFF)",
          light: "#962dffb5",
        },
        mygray: {
          DEFAULT: "#f3f4f6",
        },
      },
      fontFamily: {
        inter: ["Inter Variable", "sans-serif"],
      },
    },
  },
  plugins: [],
};
