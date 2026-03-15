/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'arcade-green': '#39ff14',
        'arcade-blue': '#00f0ff',
        'arcade-red': '#ff003c',
        'arcade-black': '#0a0a0c',
      },
      fontFamily: {
        retro: ['"Press Start 2P"', '"VT323"', 'monospace'],
      },
      animation: {
        flicker: 'flicker 1.5s infinite alternate',
      },
      keyframes: {
        flicker: {
          '0%, 19%, 21%, 23%, 25%, 54%, 56%, 100%': { opacity: '1' },
          '20%, 24%, 55%': { opacity: '0.6' },
        },
      },
    },
  },
  plugins: [],
}