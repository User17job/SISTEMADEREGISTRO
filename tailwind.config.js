/** @type {import('tailwindcss').Config} */
export default {
  // Asegúrate de que las rutas sean correctas y absolutas
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-theme": "linear-gradient(to bottom right, #bfdbfe, #93c5fd)",
      },
    },
  },
  plugins: [],
};
