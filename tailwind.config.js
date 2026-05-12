/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./pages/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
      },
      letterSpacing: { tightest: "-0.03em" },
      boxShadow: {
        glow: "0 0 60px -10px rgba(16,185,129,0.35)",
        glowSoft: "0 0 80px -20px rgba(16,185,129,0.25)",
      },
    },
  },
  plugins: [],
};
