import type { Config } from 'tailwindcss'

const config: Config = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        mypurple: {
          DEFAULT: "#962DFF",
          light: "#962dffb5",
        },

        mygray: {
          DEFAULT: "#f3f4f6",
        },
        // Add more custom colors here
      },
      fontFamily: {
        inter: ["Inter Variable", "sans-serif"],
        // Add more custom fonts here
      },
      // Add more customizations (spacing, borderRadius, etc.) here
    },
  },
  plugins: [],
};

export default config