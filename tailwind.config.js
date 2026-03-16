/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Bebas Neue", "system-ui"],
        body: ["Outfit", "system-ui"],
        mono: ["DM Mono", "monospace"],
      },
      colors: {
        void: { DEFAULT: "#030308", 1: "#080812", 2: "#0d0d1e", 3: "#121228" },
        amber: { DEFAULT: "#ff9500", dim: "rgba(255,149,0,0.12)", glow: "rgba(255,149,0,0.25)" },
        ice: { DEFAULT: "#00ffcc", dim: "rgba(0,255,204,0.08)" },
        crimson: "#ff3366",
        violet: "#7b5ea7",
      },
    },
  },
  plugins: [],
};