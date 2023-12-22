module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class', // This enables class-based dark mode
  theme: {
    extend: {
      fontFamily: {
        sans: ['Raleway', 'sans-serif'],
        open: ['Open Sans', 'sans-serif'],
      },
      colors: {
        "primary-color": "#0e907c",
        "secondary-color": "#00ffd2",
        "white-color": "#fafafa",
        "light-color": "#fcfcfc",
        "light2-color": "#f0f0f0",
        "black-color": "#191919",
        "dark-color": "#212121",
        "dark2-color": "#2f2f2f",
      },
      darkSelector: '.dark-mode',
    },
    variants: {
      extend: {
        backgroundColor: ['dark'], 
        textColor: ['dark'],
        borderColor: ['dark'],
      },
    },
  },
  plugins: [],
}
