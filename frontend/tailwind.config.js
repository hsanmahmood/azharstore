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
        "background-dark": "#161617",
        brand: {
          background: "#1a1a1a",
          gray: "#6e6c6f",
          white: "#ffffff",
          black: "#000000",
          primary: "#ffffff",
          secondary: "#a0a0a0",
          border: "rgba(255, 255, 255, 0.1)",
        },
      },
      borderRadius: {
        20: "20px",
      },
      boxShadow: {
        card: "0 8px 24px rgba(0,0,0,0.4)",
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
