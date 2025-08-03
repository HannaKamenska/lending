/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        // Основная бежевая палитра
        beige: {
          50: '#FEFEF8',
          100: '#FDF8E7',
          200: '#F5F5DC',
          300: '#F0ECD0',
          400: '#E6D3A3',
          500: '#D4B894',
          600: '#C4A777',
          700: '#B3935A',
          800: '#8B7355',
          900: '#6B5940'
        },
        // Лавандовая палитра
        lavender: {
          50: '#FAF9FF',
          100: '#F3F0FF',
          200: '#E6E6FA',
          300: '#DDD6FE',
          400: '#D8BFD8',
          500: '#C4B0D6',
          600: '#B19CD9',
          700: '#9F7AEA',
          800: '#7C3AED',
          900: '#5B21B6'
        },
        // Лимонное золото
        gold: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#F0E68C',
          500: '#FFD700',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F'
        }
      },
      fontFamily: {
        'sans': ['Inter', 'ui-sans-serif', 'system-ui'],
        'serif': ['Playfair Display', 'Georgia', 'serif'],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      }
    },
  },
  plugins: [],
}