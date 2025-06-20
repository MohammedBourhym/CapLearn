/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gray: {
          750: '#2d3748', // Custom color between gray-700 and gray-800
        },
        blue: {
          950: '#172554', // Deep blue for dark mode
        },
      },
    },
  },
  plugins: [],
}
