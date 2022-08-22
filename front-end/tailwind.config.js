/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gray: {
          700: "#212126",
          600: "#2D2D33",
          500: "#36363C",
          400: "#44444B",
          300: "#57575F",
          200: "#81818A",
          100: "#BCBCC2",
        },
        warning: {
          300: "#FFC144",
          700: "#4A443D",
        },
        accept: {
          300: "#7BC377",
          700: "#3D4442",
        },
        error: {
          300: "#E87F81",
          700: "#473C41",
        },
        contrast: {
          100: '#B0A2FC',
          300: '#8678D7',
          500: '#595285',
          700: '#3B374D',
        }
      }
    }
  },
  plugins: [],
}
