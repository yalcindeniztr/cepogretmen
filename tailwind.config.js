/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        maarif: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7cc5fb',
          400: '#36a7f7',
          500: '#0c8ce9',
          600: '#026fc7',
          700: '#0358a1',
          800: '#074b85',
          900: '#0c3f6e',
          950: '#082849',
        },
        ottoman: {
          50: '#fbf5f2',
          100: '#f6eae3',
          200: '#ebd4c7',
          300: '#dcbaa5',
          400: '#ca9a80',
          500: '#bc8063',
          600: '#ad6c51',
          700: '#905541',
          800: '#754738',
          900: '#603c31',
        },
        gold: {
          400: '#f6c944',
          500: '#e5b225',
          600: '#ca9418',
        }
      },
      boxShadow: {
        'emboss': '4px 4px 10px rgba(0, 0, 0, 0.1), -3px -3px 8px rgba(255, 255, 255, 0.9)',
        'emboss-dark': '5px 5px 12px rgba(0, 0, 0, 0.4), -3px -3px 8px rgba(255, 255, 255, 0.05)',
        'emboss-sm': '2px 2px 5px rgba(0, 0, 0, 0.08), -2px -2px 5px rgba(255, 255, 255, 0.8)',
        'emboss-pressed': 'inset 3px 3px 6px rgba(0, 0, 0, 0.15), inset -2px -2px 5px rgba(255, 255, 255, 0.7)',
        'vibrant-blue': '0 10px 25px -5px rgba(12, 140, 233, 0.4), 0 8px 10px -6px rgba(12, 140, 233, 0.2)',
        'vibrant-amber': '0 10px 25px -5px rgba(229, 178, 37, 0.4), 0 8px 10px -6px rgba(229, 178, 37, 0.2)',
        'vibrant-emerald': '0 10px 25px -5px rgba(16, 185, 129, 0.4), 0 8px 10px -6px rgba(16, 185, 129, 0.2)',
        'vibrant-purple': '0 10px 25px -5px rgba(168, 85, 247, 0.4), 0 8px 10px -6px rgba(168, 85, 247, 0.2)',
      }
    },
  },
  plugins: [],
}
