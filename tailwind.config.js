/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4263eb',
          50: '#f0f3fe',
          100: '#dde4fc',
          200: '#c3d1fa',
          300: '#99b4f7',
          400: '#698df1',
          500: '#4263eb',
          600: '#3047e0',
          700: '#2835cd',
          800: '#262ca7',
          900: '#242b84',
          950: '#1a1d51',
          dark: '#334ec2',
          light: '#6c86f2',
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
        },
        // Surface colors for backgrounds and borders
        surface: {
          DEFAULT: '#ffffff',
          extraSoft: '#f8fafc',
          soft: '#f3f5f8',
          secondary: '#f5f8fb',
          alt: '#f8fafc', // Slate-50
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
