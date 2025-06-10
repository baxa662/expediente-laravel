/* @type {import('tailwindcss').Config} */
import daisyui from 'daisyui'

module.exports = {
  content: ["./welcome.blade", "./resources/js/**/*.{js,ts,jsx,tsx}"],
  plugins: [daisyui],
  daisyui: {
    themes: ["fantasy"],
  },
};
