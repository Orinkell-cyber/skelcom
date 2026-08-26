/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // 🎨 Palette de couleurs "Magnifiques & Modernes"
      colors: {
        brand: {
          light: '#fdf6f0',  // Fond chaud et doux (style éditorial)
          dark: '#1a1523',   // Violet/noir profond pour le texte sombre
          accent: '#e76f51', // Corail vibrant pour attirer l'attention
        },
        pastel: {
          pink: '#fbc4ab',
          mint: '#c1d3fe',
          purple: '#e2afff',
        }
      },
      // ✍️ Polices d'écriture "Artistiques & Élégantes"
      fontFamily: {
        // Pour les grands titres (artistique/littéraire)
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        // Pour le texte de lecture (ultra moderne et propre)
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        // Pour un effet manuscrit/créatif si besoin
        creative: ['"Caveat"', 'cursive'],
      },
    },
  },
  plugins: [],
}
