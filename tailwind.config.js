/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: '#0B2442',
        teal: '#2AA7A1',
        gold: {
          DEFAULT: '#BE8A2F',
          dark: '#9A6E25',
        },
        cream: '#F7F5F2',
        dark: '#232629',
      },
      fontFamily: {
        heading: ['Oswald', 'sans-serif'],
        subheading: ['Roboto Condensed', 'sans-serif'],
        body: [
          'Oswald',
          'Roboto Condensed',
          'Proxima Nova',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      screens: {
        'mobile': '360px',
        'tablet': '768px',
        'desktop': '1280px',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out',
        'lift': 'lift 0.3s ease-out',
        'underline-from-left': 'underlineFromLeft 0.15s ease-out forwards',
        'footer-reveal': 'footerReveal 0.4s ease-out forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          },
        },
        lift: {
          '0%': {
            transform: 'translateY(0) scale(1)'
          },
          '100%': {
            transform: 'translateY(-4px) scale(1.02)'
          },
        },
        underlineFromLeft: {
          '0%': {
            width: '0',
            left: '0',
          },
          '100%': {
            width: '100%',
            left: '0',
          },
        },
        footerReveal: {
          '0%': {
            opacity: '0',
            transform: 'translateY(60px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
      },
      spacing: {
        'section-sm': '3rem',
        'section-md': '5rem',
        'section-lg': '7rem',
        'section-mobile': '3.75rem', // 60px
        'section-mobile-lg': '5rem', // 80px
        'section-tablet': '5rem', // 80px
        'section-tablet-lg': '6.25rem', // 100px
        'section-desktop': '7.5rem', // 120px
        'section-desktop-lg': '10rem', // 160px
      },
      fontSize: {
        // Typography scale variables
        'h1-mobile': ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }], // 60px
        'h1-desktop': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }], // 72px
        'h2-mobile': ['2.125rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }], // 34px
        'h2-desktop': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }], // 48px
        'body-mobile': ['1.125rem', { lineHeight: '1.6' }], // 18px
        'body-desktop': ['1.25rem', { lineHeight: '1.6' }], // 20px
      },
      boxShadow: {
        'lift': '0 10px 30px -5px rgba(11, 36, 66, 0.2)',
        'lift-lg': '0 20px 40px -10px rgba(11, 36, 66, 0.3)',
      },
    },
  },
  plugins: [],
}
