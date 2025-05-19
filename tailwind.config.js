/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'custom-divider': '#A29C905C',
        'custom-bg': '#E8DED1',
        'custom2-bg': '#A39B8F',
        'title-bg': '#786B54',
        'title': '#EEEAE2',
        'custom-font': '#8F8A80'
      }
    },
    screens: {}
  },
  plugins: []
}
