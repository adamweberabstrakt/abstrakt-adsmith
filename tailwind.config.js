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
        'abstrakt-orange': '#e85d04',
        'abstrakt-orange-light': '#f48c06',
        'abstrakt-bg': '#3d3d3d',
        'abstrakt-card': '#2a2a2a',
        'abstrakt-card-border': '#4a4a4a',
        'abstrakt-input': '#333333',
        'abstrakt-input-border': '#555555',
        'abstrakt-text-muted': '#b0b0b0',
        'abstrakt-text-dim': '#808080',
      },
      fontFamily: {
        heading: ['Oswald', 'sans-serif'],
        sans: ['var(--font-inter)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
