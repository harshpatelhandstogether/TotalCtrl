/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['SourceSans3', 'sans-serif'],
        source: ["SourceSans3", "sans-serif"],
      }
    },
  },
  plugins: [],
};