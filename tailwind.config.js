/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
      },
      colors: {
        gray: {
          50: '#f9fafb',
          100: '#f1f3f4',
          200: '#e1e4e8',
          300: '#d0d7de',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#30363d',
          800: '#21262d',
          900: '#0d1117',
        },
        blue: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        primary: {
          50: 'rgb(var(--color-primary-light) / 0.1)',
          100: 'rgb(var(--color-primary-light) / 0.2)',
          200: 'rgb(var(--color-primary-light) / 0.3)',
          300: 'var(--color-primary-light)',
          400: 'var(--color-primary)',
          500: 'var(--color-primary)',
          600: 'var(--color-primary-hover)',
          700: 'var(--color-primary-hover)',
          800: 'var(--color-primary-hover)',
          900: 'var(--color-primary-hover)',
        },
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};