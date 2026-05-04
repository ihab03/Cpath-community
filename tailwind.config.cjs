/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cpath: {
          orange: '#DC5F00',
          yellow: '#D97706',
          dark: '#222222',
        }
      },
      fontFamily: {
        roboto: ["Roboto Flex", "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
}