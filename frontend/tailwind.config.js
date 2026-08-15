/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx,js,jsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        headline: ['Quicksand', 'sans-serif'],
        body: ['Nunito Sans', 'sans-serif'],
        sans: ['Nunito Sans', 'sans-serif'],
      },
      colors: {
        surface: {
          DEFAULT: '#f4fafd',
          dim: '#d4dbdd',
          bright: '#f4fafd',
          lowest: '#ffffff',
          low: '#eef5f7',
          container: '#e8eff1',
          high: '#e2e9ec',
          highest: '#dde4e6',
        },
        'on-surface': {
          DEFAULT: '#161d1f',
          variant: '#414751',
        },
        primary: {
          DEFAULT: '#005da7',
          blue: '#4A90E2',
          container: '#2976c7',
          fixed: '#d4e3ff',
          'fixed-dim': '#a4c9ff',
        },
        secondary: {
          DEFAULT: '#835500',
          yellow: '#F5A623',
          container: '#feae2c',
          'on-container': '#6b4500',
        },
        tertiary: {
          DEFAULT: '#386800',
          green: '#7ED321',
          container: '#498300',
          'on-container': '#f9ffeb',
        },
        brand: {
          50:  '#f4fafd',
          100: '#d4e3ff',
          200: '#a4c9ff',
          300: '#4A90E2',
          400: '#2976c7',
          500: '#005da7',
          600: '#004883',
          700: '#003360',
          800: '#001c39',
          900: '#001024',
        },
      },
      boxShadow: {
        level1: '0 4px 20px rgba(0, 93, 167, 0.05)',
        level2: '0 8px 24px rgba(0, 93, 167, 0.10)',
        level3: '0 16px 40px rgba(22, 29, 31, 0.15)',
      },
      borderRadius: {
        '2xl': '1.5rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'bounce-subtle': 'bounceSubtle 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
      },
    },
  },
  plugins: [],
};
