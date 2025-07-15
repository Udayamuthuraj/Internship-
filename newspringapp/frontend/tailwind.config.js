/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
      cardinal: "#930911",
      rose: "#BA3D47",
      warmgray: "#CA5C62",
      mutedpink: "#EEC8B9",
      deeprose: "#E4A39D",
      softcoral: "#FFE9D4",
      beige: "#FFF7EC",
      },
    },
  },
  plugins: [],
};
