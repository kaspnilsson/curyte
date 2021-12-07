module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'media',
  theme: {
    extend: {},
  },
  variants: {
    extend: {
      opacity: ['disabled'],
      visibility: ['group-hover'],
    },
  },
  plugins: [],
}
