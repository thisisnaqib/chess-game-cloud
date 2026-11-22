/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        nomad: {
          sand: {
            DEFAULT: '#D4A373',
            50: '#FDFBF7',
            100: '#FAEDCD',
            200: '#E9D5A1',
            300: '#DEC089',
            400: '#D4A373',
            500: '#C28956',
            600: '#A46E3F',
            700: '#7E532F',
            800: '#5A3B22',
            900: '#3D2716',
          },
          ocean: {
            DEFAULT: '#0891B2',
            light: '#06B6D4',
            dark: '#0E7490',
          },
          forest: {
            DEFAULT: '#166534',
            light: '#15803D',
            dark: '#14532D',
          },
          background: '#FFFDF7',
          surface: '#FFFFFF',
          warning: '#CA8A04',
          error: '#DC2626',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
