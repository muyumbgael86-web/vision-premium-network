/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'heart-burst': 'heart-burst 0.3s ease-out',
        'progress': 'progress 5s linear forwards',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
      boxShadow: {
        'premium': '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}
