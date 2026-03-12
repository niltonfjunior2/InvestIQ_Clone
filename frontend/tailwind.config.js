/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          blue:   '#4A90D9',
          yellow: '#F59E0B',
          purple: '#8B6FD4',
          gold:   '#E8C96A',
          green:  '#2DBA74',
          red:    '#E05252',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
