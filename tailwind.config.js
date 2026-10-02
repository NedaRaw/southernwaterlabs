/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"IBM Plex Sans Arabic"', '"IBM Plex Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        arabic: ['"IBM Plex Sans Arabic"', 'system-ui', 'sans-serif'],
        latin: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
        accent: ['"Noto Sans Arabic"', 'system-ui', 'sans-serif'],
      },
      colors: {
        navy: {
          50: '#f0f4f9',
          100: '#dce5f1',
          200: '#bdd0e6',
          300: '#92b3d6',
          400: '#6290c2',
          500: '#3f72aa',
          600: '#2f598e',
          700: '#264773',
          800: '#1e385c',
          900: '#0f233d',
          950: '#071324',
        },
        water: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        aqua: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
        },
      },
      spacing: {
        '4.5': '1.125rem',
      },
    },
  },
  plugins: [],
};
