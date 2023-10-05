/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,tx,jsx,tsx}",
    "./index.html"
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
    // ...
  ],
}