/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#F2F7F4',
          100: '#E1ECE6',
          200: '#C2D9CD',
          300: '#9BBFA9',
          400: '#5F9779',
          500: '#2D5242',
          600: '#244537',
          700: '#1E3A2F', // Primary Forest Green
          800: '#172E25',
          900: '#10221B',
          950: '#0B1712'
        },
        bronze: {
          50: '#F9F7F2',
          100: '#F1ECE2',
          200: '#E2D7C2',
          300: '#CDBDA0',
          400: '#B09C7A',
          500: '#8C7758', // Warm Bronze
          600: '#756247',
          700: '#5A4A35',
          800: '#433727',
          900: '#2E251B'
        },
        cream: {
          50: '#FAF8F5',
          100: '#F5F2EB', // Base background cream
          200: '#ECE6DA',
          300: '#DDD5C4',
          400: '#C8BEA7',
          500: '#B0A389'
        },
        charcoal: {
          DEFAULT: '#1C2A24',
          muted: '#617067',
          light: '#3C4D44'
        }
      }
    },
  },
  plugins: [],
}
