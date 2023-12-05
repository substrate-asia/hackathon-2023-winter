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
    colors: {
      ...twColorTokens,
    },
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
