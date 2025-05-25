export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  safelist: [
    'bg-mypurple',
    'hover:bg-mypurple-light',
    'text-mypurple',
  ],
  theme: {
    extend: {
      colors: {
        mypurple: {
          DEFAULT: "#962DFF",   // add a comment to trigger rebuild
          light: "#962dffb5",
        },
      },
    },
  },
  plugins: [],
};
