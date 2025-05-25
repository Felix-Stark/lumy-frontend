export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  safelist: [
    'bg-mypurple',
    'hover:bg-mypurple-light',
  ],
  theme: {
    extend: {
      colors: {
        mypurple: {
          DEFAULT: "#962DFF",
          light: "#962dffb5",
        },
      },
    },
  },
  plugins: [],
};
