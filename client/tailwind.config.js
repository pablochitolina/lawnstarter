/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'green-sw': '#0ab463',
        'warm-grey-75': '#afafaf',
        'light-gray': '#dadada',
        'bg-gray': '#ededed',
        'input-bg': '#ededed',
      },
      boxShadow: {
        'card': '0 0.5px 1px 0 #afafaf',
      }
    },
  },
  plugins: [],
}
