/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#5564db',
          50: '#f3f5fe',
          100: '#e6eafc',
          200: '#d0d8f7',
          300: '#b4c0f1',
          400: '#6a78e4',
          500: '#5564db',
          600: '#4858cc',
          700: '#3e4bb3',
          800: '#364096',
          900: '#323a78',
          950: '#1e2248',
          dark: '#3e4bb3',
          light: '#6a78e4',
        },
        secondary: {
          DEFAULT: '#091940',
          dark: '#00143b',
          darker: '#142046',
        },
        success: '#0ac57d',
        info: '#50b5ff',
        warning: '#f1b44c',
        danger: '#f4516c',
        inputBorder: '#e2e8f0',
        // New Text Palette
        txt: {
          primary: '#1d2c48', // Slate-900: Headings & Core content
          secondary: '#373f57ff', // Slate-700: Body text
          muted: '#64748b', // Slate-500: Secondary info/Captions
          light: '#8e93a7ff', // Slate-400: Placeholders/Disabled (Light)
          disabled: '#cbd5e1', // Slate-300: Disabled states
          highlight: '#4263eb',
        },
        // Surface colors for backgrounds and borders
        surface: {
          DEFAULT: '#ffffff',
          extraSoft: '#fcfdff',
          soft: '#f6f8fb',
          medium: '#e8ecf4',
          dark: '#d1d9e8',
          border: '#dde3ebff', // Slate-200
        },
      },
      boxShadow: {
        card: '0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)',
        'card-hover': '0 0.5rem 1rem rgba(0, 0, 0, 0.15)',
        header: '0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)',
        'soft-xs': '0 1px 5px 0 rgba(0, 0, 0, 0.05)',
        'soft-sm': '0 2px 12px -3px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.04)',
        'soft-md': '0 4px 18px -4px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'soft-lg': '0 12px 30px -6px rgba(0, 0, 0, 0.12), 0 8px 12px -8px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
};
