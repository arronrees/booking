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
        'dark-blue-1': '#0B121D',
        'dark-blue': '#090F18',
        'dark-blue2': '#05090F',
        'dark-blue3': '#04060B',
        'mid-blue-1': '#253040',
        'mid-blue': '#171E28',
        'mid-blue2': '#121820',
        'mid-blue3': '#11161D',
        'light-blue-1': '#6A95D7',
        'light-blue': '#5E84BE',
        'light-blue2': '#597DB2',
        'light-blue3': '#5274A6',
        'gold-1': '#F0BE0E',
        gold: '#D0A50B',
        gold2: '#B48F0B',
        gold3: '#A6840B',
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
