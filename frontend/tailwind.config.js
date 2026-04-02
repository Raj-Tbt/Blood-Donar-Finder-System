/**
 * Tailwind CSS Configuration
 *
 * Extends the default theme with custom colors, fonts, and animations
 * specific to the Blood Donor Finder System design language.
 *
 * @type {import('tailwindcss').Config}
 */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        /* Application primary color palette */
        blood: {
          50: '#FDF2F2',
          100: '#FCE4E4',
          200: '#F9CACA',
          300: '#F3A3A3',
          400: '#EC7676',
          500: '#C0392B',
          600: '#A93226',
          700: '#922B21',
          800: '#7B241C',
          900: '#641E16',
        },
        /* Dark mode surface colors */
        dark: {
          bg: '#1A1A2E',
          surface: '#16213E',
          card: '#0F3460',
          accent: '#E94560',
        },
        /* Accent gold for badges and highlights */
        gold: {
          400: '#F5C542',
          500: '#F39C12',
          600: '#D68910',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'slide-up': 'slideUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
        'badge-reveal': 'badgeReveal 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'counter': 'counter 2s ease-out',
        'blood-drop': 'bloodDrop 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(192, 57, 43, 0.5)' },
          '100%': { boxShadow: '0 0 25px rgba(192, 57, 43, 0.8)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        badgeReveal: {
          '0%': { transform: 'scale(0) rotate(-180deg)', opacity: '0' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
        },
        bloodDrop: {
          '0%, 100%': { transform: 'translateY(0) scale(1)' },
          '50%': { transform: 'translateY(-10px) scale(1.05)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
