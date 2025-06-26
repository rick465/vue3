/** @type {import('tailwindcss').Config} */
import importForms from '@tailwindcss/forms'
import importTypography from '@tailwindcss/typography'

export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    importForms,
    importTypography,
  ],
}
