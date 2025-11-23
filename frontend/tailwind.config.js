/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ['Tajawal', 'sans-serif'],
        arabic: ['Tajawal', 'sans-serif'],
      },
      colors: {
        "primary-background": "#f4f0f4",
        "brand-purple": "#742370",
        "text-dark": "#1f2937",
        "text-light": "#4a4a4a",
        "stock-green": "#10b981",
        "stock-orange": "#f59e0b",
        "stock-red": "#ef4444",
        "category-purple": "#E0C0E0",
        "category-blue": "#C0C0E0",
        "card-background": "rgba(255, 255, 255, 0.6)",
        "soft-border": "#dcd9dc",
        brand: {
          background: "#f4f0f4",
          gray: "#6e6c6f",
          white: "#ffffff",
          black: "#000000",
          primary: "#742370",
          secondary: "#a0a0a0",
          border: "#dcd9dc",
        },
      },
      borderRadius: {
        20: "20px",
      },
      boxShadow: {
        card: "0 4px 12px rgba(0,0,0,0.05)",
      },
      keyframes: {
        modalIn: {
          "0%": { opacity: 0, transform: "translateY(20px) scale(0.98)" },
          "100%": { opacity: 1, transform: "translateY(0) scale(1)" },
        },
        fadeOut: {
          "100%": { opacity: 0, transform: "scale(0.95)" },
        },
        fadeInUp: {
          "0%": { opacity: 0, transform: "translateY(20px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
      animation: {
        "modal-in": "modalIn 300ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-out": "fadeOut 300ms ease-out forwards",
        "fade-in-up": "fadeInUp 400ms ease-out forwards",
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide')
  ],
};