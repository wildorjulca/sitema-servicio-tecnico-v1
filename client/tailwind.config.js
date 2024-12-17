/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      colors: {
        border: '#e5e7eb', // Define el color para 'border'
      },
    },
  },
  plugins: [],
}

