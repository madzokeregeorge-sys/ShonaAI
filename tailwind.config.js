/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        zim: {
          green: '#2E8540', 
          yellow: '#F7C900', 
          red: '#D62828',    
          black: '#000000',
          dark: '#1a1a1a', 
        },
        brand: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#2E8540',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#000000',
        }
      }
    },
  },
  plugins: [],
}