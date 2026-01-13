/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
            'green-sw': '#0ab463', // Approximated from "Green" requests
            'warm-grey-75': '#afafaf', // Guessing hex based on name or provided code snippet usage
            'light-gray': '#dadada', // Guessing
            'bg-gray': '#ededed',
        },
        boxShadow: {
            'card': '0 0.5px 1px 0 rgba(0,0,0,0.1)', // Approximate var(--warm-grey-75)
        }
      },
    },
    plugins: [],
  }
