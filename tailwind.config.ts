const config = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
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

export default config;
