/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        retro: ['"Press Start 2P"', 'cursive'],
        mono: ['"VT323"', 'monospace']
      },
      colors: {
        arcade: {
          black: '#0a0a0c',
          green: '#39ff14',
          red: '#ff003c',
          blue: '#00f0ff',
          neon: '#bfff00'
        }
      },
      animation: {
        'scanline': 'scanline 8s linear infinite',
        'flicker': 'flicker 0.15s infinite'
      },
      keyframes: {
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' }
        },
        flicker: {
          '0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100%': { opacity: 0.99 },
          '20%, 21.999%, 63%, 63.999%, 65%, 69.999%': { opacity: 0.4 }
        }
      }
    },
  },
  plugins: [],
}
