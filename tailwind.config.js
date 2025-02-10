/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bruised-purple': '#5B3F8D',
        'antique-gold': '#D4C29A',
        'aged-wine-red': '#8B2A2A',
        'dark-gray': '#1A1A1A', // Added new color for dark gray
      },
    },
  },
  plugins: [],
}
