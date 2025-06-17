/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4263eb', // rgb(66, 99, 235)
          dark: '#334ec2', // rgb(51, 78, 194)
          light: '#6c86f2', // rgb(108, 134, 242)
        },
        secondary: {
          dark: '#00143b',
          darker: '#142046',
        },
        success: '#0ac57d', // rgb(10, 197, 125)
        info: '#50b5ff', // rgb(80, 181, 255)
        warning: '#f1b44c', // rgb(241, 180, 76)
        danger: '#f4516c', // rgb(244, 81, 108)
      },
      boxShadow: {
        card: '0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)',
        'card-hover': '0 0.5rem 1rem rgba(0, 0, 0, 0.15)',
        header: '0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)',
      },
    },
  },
  plugins: [],
};
