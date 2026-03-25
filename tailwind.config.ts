import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#E8344E',
        secondary: '#22C55E',
        accent: '#F2839A',
        navy: '#1A1B4B',
        dark: '#0A0A0A',
        border: '#E5E7EB',
        card: '#F8FAFC',
        'text-primary': '#0F172A',
        'text-soft': '#64748B',
      },
      fontFamily: {
        sans: ['var(--font-sloth)', 'sans-serif'],
        sloth: ['var(--font-sloth)', 'sans-serif'],
      },
      animation: {
        'pulse-dot': 'pulse-dot 2s ease-in-out infinite',
        float: 'float 6s ease-in-out infinite',
      },
      keyframes: {
        'pulse-dot': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(0.85)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
