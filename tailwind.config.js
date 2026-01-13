/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Abstrakt Brand Colors
        'abstrakt-bg': '#0a0a0a',
        'abstrakt-card': '#141414',
        'abstrakt-card-border': '#1e1e1e',
        'abstrakt-orange': '#e85d04',
        'abstrakt-orange-dark': '#c44d03',
        'abstrakt-orange-light': '#ff6b1a',
        'abstrakt-text': '#ffffff',
        'abstrakt-text-muted': '#9a9a9a',
        'abstrakt-text-dim': '#666666',
        'abstrakt-input': '#1a1a1a',
        'abstrakt-input-border': '#333333',
        'abstrakt-success': '#22c55e',
        'abstrakt-warning': '#eab308',
        'abstrakt-error': '#ef4444',
      },
      fontFamily: {
        'heading': ['Oswald', 'Impact', 'sans-serif'],
        'body': ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-dark': 'linear-gradient(180deg, #0a0a0a 0%, #141414 100%)',
        'glow-orange': 'radial-gradient(circle at center, rgba(232, 93, 4, 0.15) 0%, transparent 70%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(232, 93, 4, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(232, 93, 4, 0.5)' },
        },
      },
    },
  },
  plugins: [],
}
