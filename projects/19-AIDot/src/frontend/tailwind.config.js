/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      zIndex: {
        '2509': '2509'},
      colors: {
        customGray: '#F0F2F5',
        freakBlue: '#35346A',
        lightPink:'#F2BCE6',
        pink:'#E6007A',
        pink2:'#E6449A'
      },
      backgroundImage: {
        'linearBlue': 'linear-gradient(to bottom, #45438D, #5C8AB5)',
        'linearBlue2': 'linear-gradient(to right, #45438D, #5C8AB5)',
        'linearPink': 'linear-gradient(to right, #E6007A, #9E00FF)',
        'linearPink2': 'linear-gradient(to right, #E6449A, #9E00FF)',
        'linearPink3': 'linear-gradient(to right, rgba(230, 68, 154, 0.5), rgba(158, 0, 255, 0.5))',
        'lightLinearPink': 'linear-gradient(to bottom, #E9D1F9, #E8BCD3)',

      }
    },
  },
  plugins: [],
}

