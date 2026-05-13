/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./pages/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
        serif: ["Cormorant Garamond", "Playfair Display", "ui-serif", "Georgia", "serif"],
      },
      colors: {
        sage: {
          50: "#F2F5F0",
          100: "#E1E9DD",
          200: "#C4D2BD",
          300: "#A4BB9C",
          400: "#85A07D",
          500: "#6E8B66",
          600: "#587053",
          700: "#465A43",
          800: "#36443A",
          900: "#1F2A1F",
        },
        ink: { 950: "#050605", 900: "#0A0C0B", 800: "#141815" },
        bone: { 50: "#F2EFE8", 100: "#E9E5DB", 200: "#D9D3C5" },
      },
      letterSpacing: { tightest: "-0.04em", tighter: "-0.025em" },
      boxShadow: {
        soft: "0 2px 12px -2px rgba(0,0,0,0.06)",
        glow: "0 0 80px -10px rgba(133,160,125,0.45)",
      },
    },
  },
  plugins: [],
};
