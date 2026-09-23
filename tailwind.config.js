/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f0f5fa',
          100: '#e0ebf5',
          200: '#c1d7eb',
          300: '#9bb8d9',
          400: '#6e93c2',
          500: '#4a73a8',
          600: '#3a5e8f',
          700: '#2f4a72',
          800: '#1e3a5f',
          900: '#152a47',
          950: '#0d1a2e',
        },
      },
    },
  },
  plugins: [],
};
