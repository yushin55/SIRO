/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#7C6FFF',
          light: '#A99EFF',
          dark: '#5B4DDB',
          50: '#F5F3FF',
          100: '#EBE8FF',
        },
        secondary: {
          DEFAULT: '#FF8FB5',
          light: '#FFB5D0',
          dark: '#FF6B9D',
        },
        accent: {
          yellow: '#FFDC85',
          green: '#A8E6CF',
          blue: '#B4D7FF',
          pink: '#FFD4E5',
          peach: '#FFCAB0',
        },
        level: {
          1: '#FFF4E0',
          2: '#E8F4FF',
          3: '#FFE8F1',
        },
        bg: {
          primary: '#FAFBFF',
          secondary: '#F8F9FF',
          tertiary: '#FFF9F5',
          card: '#FFFFFF',
          soft: '#F5F7FF',
        },
        text: {
          primary: '#2D2D2D',
          secondary: '#6B7280',
          light: '#9CA3AF',
          lighter: '#D1D5DB',
        },
      },
      borderRadius: {
        'sm': '16px',
        'md': '24px',
        'lg': '32px',
        'xl': '40px',
        '2xl': '48px',
        '3xl': '56px',
      },
      spacing: {
        'xs': '8px',
        'sm': '16px',
        'md': '24px',
        'lg': '40px',
        'xl': '64px',
        '2xl': '96px',
      },
      boxShadow: {
        'soft': '0 2px 16px rgba(124, 111, 255, 0.06)',
        'card': '0 4px 24px rgba(124, 111, 255, 0.08)',
        'hover': '0 8px 32px rgba(124, 111, 255, 0.12)',
        'float': '0 12px 48px rgba(124, 111, 255, 0.15)',
      },
      fontSize: {
        'xs': '0.75rem',
        'sm': '0.875rem',
        'base': '1rem',
        'lg': '1.125rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
        '6xl': '3.75rem',
      },
      fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
      },
    },
  },
  plugins: [],
}
