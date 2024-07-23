/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui'
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '0.75rem'
    },
    extend: {}
  },
  plugins: [daisyui],
  daisyui: {
    themes: ['light', 'dark']
  }
}
