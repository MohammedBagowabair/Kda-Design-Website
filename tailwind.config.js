/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        dusk: { DEFAULT: '#17151F', 2: '#221F2D', 3: '#2E2A3B', soft: '#B3ADC2' },
        linen: { DEFAULT: '#F3EFE9', 2: '#E9E3DA', 3: '#D9D1C5' },
        ink: { DEFAULT: '#1E1B26', soft: '#625E6B' },
        lilac: { DEFAULT: '#C3B9F0', ink: '#5A4FA0', soft: '#E4DFF8' },
        candle: '#E7B877',
      },
      fontFamily: {
        serif: ['Cormorant', 'Georgia', 'serif'],
        sans: ['Jost', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
