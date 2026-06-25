/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#eef6ff',
          100: '#d9ebff',
          200: '#b9d7ff',
          500: '#2f7df6',
          600: '#1f66db',
          700: '#1f55b3',
        },
        violet: {
          500: '#7c3aed',
          600: '#6d28d9',
        },
      },
      boxShadow: {
        glow: '0 20px 80px rgba(47, 125, 246, 0.18)',
      },
    },
  },
  plugins: [],
};
