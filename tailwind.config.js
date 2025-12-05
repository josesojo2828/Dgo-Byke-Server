// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  // Asegúrate de que darkMode esté configurado
  darkMode: 'class', 
  content: [
    "./views/**/*.hbs", // <-- ¡MUY IMPORTANTE! Escanea todos los .hbs en views
    "./public/**/*.js",   // <-- Escanea tu JS (para el theme toggle, etc.)
    // Añade aquí otras rutas si tienes clases Tailwind en archivos .ts (menos común en MVC)
    // "./src/**/*.ts", 
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
