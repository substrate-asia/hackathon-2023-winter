const { resolve } = require("node:path");
const light = require("./styles/colors").light;

/**
 * `light.neutral100` -> `{ neutral100: 'var(--neutral100)' }`
 */
const twColorTokens = Object.keys(light).reduce((value, key) => {
  value[key.replace("--", "")] = `var(${key})`;
  return value;
}, {});

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    resolve(__dirname, "./pages/**/*.{js,jsx}"),
    resolve(__dirname, "./components/**/*.{js,jsx}"),
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        ...twColorTokens,
      },
      boxShadow: {
        "shadow-card-default":
          "0px 0.75px 4px rgba(26, 33, 44, 0.03), 0px 4px 31px rgba(26, 33, 44, 0.04)",
        "shadow-card-hover":
          "0px 0.75px 8px rgba(26, 33, 44, 0.06), 0px 4px 31px rgba(26, 33, 44, 0.08)",
        "shadow-popup":
          "0px 0.75px 8px rgba(26, 33, 44, 0.06), 0px 4px 31px rgba(26, 33, 44, 0.08)",
      },
    },
  },
  plugins: [require("./styles/tailwind-plugins/fonts")],
};
