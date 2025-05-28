import flowbitePlugin from "flowbite/plugin";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/flowbite-react/lib/esm/**/*.js",
  ],
  theme: {
    extend: {
      fontFamily: {
        tangerine: ["Tangerine"],
        cinzel: ["Cinzel"],
        Lavish: ["sans-serif"],
        CretinaBold: ["CretinaBold"],
        CretinaRegular: ["CretinaRegular"],
        DMSerifDisplay: ["DMSerifDisplay"],
        grandHotel: ["GrandHotel", "cursive"],
        workSans: ["Work Sans", "sans-serif"],
        Sacremento: ["Sacramento"],
      },
    },
  },
  plugins: [flowbitePlugin],
};
