/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#fdfbeb',
          100: '#fbf7c7',
          200: '#f7ee90',
          300: '#f1dd50',
          400: '#eac522',
          500: '#d4af37', // Main Gold
          600: '#b48c26',
          700: '#926a1d',
          800: '#75521c',
          900: '#61431b',
          950: '#38230c',
        },
        bronze: {
          50: '#fdf8f4',
          100: '#fceddf',
          200: '#fadabf',
          300: '#f5be94',
          400: '#ee9c63',
          500: '#cd7f32', // Main Bronze
          600: '#ca6e27',
          700: '#a8541c',
          800: '#86431c',
          900: '#6d391b',
          950: '#3b1c0c',
        },
        earth: {
          50: '#faf9f6',
          100: '#f2eae1',
          200: '#e5d5c3',
          300: '#d1b89d',
          400: '#bc9876',
          500: '#aa7e58',
          600: '#9c6f4b',
          700: '#825a3d',
          800: '#6a4a34',
          900: '#563e2c',
          950: '#1d120a', // Deep Earth Tone
        },
        matte: {
          50: '#f6f6f6',
          100: '#e7e7e7',
          200: '#d1d1d1',
          300: '#b0b0b0',
          400: '#888888',
          500: '#6d6d6d',
          600: '#5d5d5d',
          700: '#4f4f4f',
          800: '#373737',
          900: '#1c1c1c',
          950: '#080808', // Matte Black
        }
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Cinzel', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
