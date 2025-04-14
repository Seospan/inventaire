/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Définissons des couleurs pour nos différents statuts
        'status-present': '#4ade80',    // Vert
        'status-to-find': '#facc15',    // Jaune
        'status-to-buy': '#f87171',     // Rouge
        'status-to-repair': '#fb923c',  // Orange
        'status-not-needed': '#94a3b8', // Gris
        'status-in-truck': '#60a5fa',   // Bleu
      },
      // Ajout de tailles personnalisées pour les box
      maxHeight: {
        '112': '28rem',
        '128': '32rem',
      }
    },
  },
  plugins: [],
  darkMode: 'class', // Activer le mode sombre
}