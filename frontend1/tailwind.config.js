/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        ink: {
          950: '#0a0a0f',
          900: '#12121a',
          800: '#1a1a28',
          700: '#252538',
          600: '#32324a',
          500: '#4a4a6a',
          400: '#6b6b8f',
          300: '#9595b8',
          200: '#c0c0d8',
          100: '#e8e8f0',
          50:  '#f4f4f8',
        },
        gold: {
          600: '#b8860b',
          500: '#d4a017',
          400: '#f0bc2e',
          300: '#f7d060',
          200: '#fbe299',
          100: '#fdf3d0',
        },
        jade: {
          600: '#0a5c4a',
          500: '#0d7a62',
          400: '#10997a',
          300: '#2db896',
          200: '#7dd9c0',
          100: '#d0f5ec',
        },
        rose: {
          600: '#9b1c3a',
          500: '#c2294b',
          400: '#e63b60',
          300: '#f07090',
          200: '#f8b0c0',
          100: '#fde8ed',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease forwards',
        'slide-up': 'slideUp 0.5s cubic-bezier(0.16,1,0.3,1) forwards',
        'slide-in-right': 'slideInRight 0.4s cubic-bezier(0.16,1,0.3,1) forwards',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'shimmer': 'shimmer 1.8s infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          from: { opacity: '0', transform: 'translateX(20px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      boxShadow: {
        'ink': '0 4px 24px rgba(10,10,15,0.3)',
        'gold': '0 4px 20px rgba(212,160,23,0.25)',
        'card': '0 2px 12px rgba(10,10,15,0.12), 0 1px 3px rgba(10,10,15,0.08)',
        'card-hover': '0 8px 32px rgba(10,10,15,0.18), 0 2px 8px rgba(10,10,15,0.1)',
      },
    },
  },
  plugins: [],
}
