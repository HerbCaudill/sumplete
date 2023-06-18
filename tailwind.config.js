const emoji = 'Segoe UI Emoji'
const mono = 'IBM Plex Mono'
const sans = 'IBM Plex Sans'
const condensed = 'IBM Plex Sans Condensed'
const serif = 'IBM Plex Serif'

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],

  // note: this needs to be kept in sync with MIN_SIZE+1 and MAX_SIZE+1 (src\constants.ts)
  safelist: [4, 5, 6, 7, 8, 9, 10].map(x => `grid-cols-${x}`),

  theme: {
    extend: {
      fontFamily: {
        mono: [mono, emoji, 'monospace'],
        sans: [sans, emoji, 'sans-serif'],
        condensed: [condensed, emoji, 'sans-serif'],
        serif: [serif, emoji, 'serif'],
      },
      fontWeight: {
        thin: '200',
        normal: '500',
        bold: '600',
        extrabold: '800',
      },
    },
  },
  plugins: [],
}
