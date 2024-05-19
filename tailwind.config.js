/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{html,js,svelte}",
  ],
  theme: {
    extend: {
      colors: {
        green: '#0a4',
      },
      gridTemplateColumns: {
        timer: '1fr auto 1fr auto 1fr',
      },
    },
  },
  plugins: [],
}

