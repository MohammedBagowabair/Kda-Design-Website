/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        night: { DEFAULT: '#191A33', 2: '#22244A', 3: '#2E3160' },
        mist: { DEFAULT: '#F2F0EC', 2: '#E7E4EE' },
        lilac: { DEFAULT: '#B9B3DC', ink: '#5B5394' },
        amber: { DEFAULT: '#E9A84F', ink: '#8A5A12' },
        muted: { DEFAULT: '#5F5E73', dark: '#A9A6BF' },
      },
      fontFamily: {
        display: ['Syne', 'system-ui', 'sans-serif'],
        sans: ['"Albert Sans"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
