/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx,css,md,mdx,html,json,scss}'],
  darkMode: 'class', // or 'media'
  plugins: [require('daisyui')],
  theme: {
    fontFamily: {
      sans: ['"Roboto"'],
    },
    extend: {
      colors: {
        error: '#ff0000',
      },
    },
  },
};
