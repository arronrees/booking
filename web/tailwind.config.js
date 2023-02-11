/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './layout/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'dark-blue': '#090F18',
        'mid-blue': '#171E28',
        'mid-blue-light': '#171E28',
        'mid-blue-med': '#171E28',
        'mid-blue-dark': '#171E28',
        'light-blue': '#5E84BE',
        'light-blue-light': '#A9BCD9',
        'light-blue-med': '#5779AD',
        'light-blue-dark': '#4B6792',
        gold: '#D0A50B',
        'gold-light': '#E6D598',
        'gold-med': '#C39B0B',
        'gold-dark': '#B6900A',
        grey: '#3A4048',
        red: '#C54C4C',
      },
      screens: {
        xs: '525px',
      },
    },
    fontFamily: {
      title: ['Lilita One', 'Exo', 'sans-serif'],
      sans: ['Exo', 'sans-serif'],
    },
  },
  plugins: [],
};
