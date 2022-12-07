/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'dark-blue': '#090F18',
        'mid-blue': '#171E28',
        'light-blue': '#5E84BE',
        gold: '#D0A50B',
      },
      screens: {
        xs: '525px',
      },
    },
    fontFamily: {
      title: ['Lilita One', 'El Messiri', 'sans-serif'],
      sans: ['El Messiri', 'sans-serif'],
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
