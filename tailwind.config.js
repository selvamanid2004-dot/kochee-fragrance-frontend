/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#000000', // Luxury Black Primary
          primaryHover: '#1f2937',
          primaryLight: '#f3f4f6',
          dark: '#000000',
          slate: '#1f2937',
          gray: '#4b5563',
          border: '#e5e7eb',
          light: '#ffffff',
          gold: '#d97706',
        }
      },
      boxShadow: {
        'luxury': '0 10px 30px -5px rgba(0, 0, 0, 0.15)',
        'luxury-card': '0 4px 20px -2px rgba(0, 0, 0, 0.06)',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'Helvetica Neue', 'Arial', 'sans-serif'],
        serif: ['Cinzel', 'Playfair Display', 'Georgia', 'serif'],
      }
    },
  },
  plugins: [],
}
