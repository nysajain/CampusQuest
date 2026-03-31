/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        asu: {
          gold:       '#FFC627',
          'gold-light': '#FFD966',
          'gold-dark':  '#E6A800',
          maroon:     '#8C1D40',
          'maroon-light': '#B5294F',
          'maroon-dark':  '#6B1530',
          black:      '#191919',
          white:      '#FFFFFF',
          gray:       '#F5F5F5',
          'gray-mid': '#DEDEDE',
          'gray-dark':'#6E6E6E',
        }
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'sans-serif'],
        body:    ['"DM Sans"', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
        'float':      'float 3s ease-in-out infinite',
        'slide-up':   'slideUp .35s cubic-bezier(.16,1,.3,1)',
        'fade-in':    'fadeIn .25s ease',
        'bounce-in':  'bounceIn .5s cubic-bezier(.36,.07,.19,.97)',
        'shimmer':    'shimmer 1.8s linear infinite',
        'spin-slow':  'spin 8s linear infinite',
      },
      keyframes: {
        pulseGold: {
          '0%,100%': { boxShadow: '0 0 0 0 rgba(255,198,39,.4)' },
          '50%':     { boxShadow: '0 0 0 8px rgba(255,198,39,0)' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%':     { transform: 'translateY(-6px)' },
        },
        slideUp: {
          from: { transform: 'translateY(24px)', opacity: 0 },
          to:   { transform: 'translateY(0)',    opacity: 1 },
        },
        fadeIn: {
          from: { opacity: 0 },
          to:   { opacity: 1 },
        },
        bounceIn: {
          '0%':   { transform: 'scale(.3)',   opacity: 0 },
          '50%':  { transform: 'scale(1.05)' },
          '70%':  { transform: 'scale(.95)' },
          '100%': { transform: 'scale(1)',    opacity: 1 },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition:  '200% 0' },
        },
      },
      backgroundImage: {
        'asu-pattern': "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23FFC627' fill-opacity='0.06'%3E%3Cpath d='M20 0L40 20L20 40L0 20z'/%3E%3C/g%3E%3C/svg%3E\")",
      }
    }
  },
  plugins: []
}
