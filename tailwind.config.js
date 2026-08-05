/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        coffee: {
          50: '#fdfbf7',
          100: '#f7f0e6',
          200: '#eddcc8',
          300: '#dec4a5',
          400: '#c59d74',
          500: '#ad7a4b',
          600: '#8f5c32',
          700: '#734626',
          800: '#543019',
          900: '#381f0f',
          950: '#1c0e06',
        },
        cream: {
          50: '#fffdfa',
          100: '#fcf6ed',
          200: '#f7ebda',
          300: '#eedabf',
          400: '#e2c39d',
        },
        terracotta: {
          400: '#ff8a65',
          500: '#f05a36',
          600: '#d9421f',
        },
        amber: {
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        },
        emerald: {
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      boxShadow: {
        'warm': '0 4px 25px -2px rgba(84, 48, 25, 0.08), 0 2px 8px -1px rgba(84, 48, 25, 0.04)',
        'warm-hover': '0 20px 40px -4px rgba(240, 90, 54, 0.18), 0 8px 16px -2px rgba(84, 48, 25, 0.1)',
        'glow-amber': '0 0 25px -3px rgba(245, 158, 11, 0.4)',
        'glow-terracotta': '0 0 25px -3px rgba(240, 90, 54, 0.4)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        }
      }
    },
  },
  plugins: [],
}
