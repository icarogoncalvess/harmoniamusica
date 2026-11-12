/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: '#FF7A00',
        ink: '#0B0D10',
        card: '#14181D',
        line: '#232A31',
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
      keyframes: { rise: { from: { opacity: 0, transform: 'translateY(8px)' }, to: { opacity: 1, transform: 'none' } } },
      animation: { rise: 'rise .35s ease both' },
    },
  },
  plugins: [],
};
