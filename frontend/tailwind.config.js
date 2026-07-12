/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: '#C88719',
          light: '#E0A03D',
          dark: '#A66F13',
        },
        bg: {
          DEFAULT: '#111827',
          sidebar: '#1F2937',
        },
        card: '#1E293B',
        border: {
          DEFAULT: '#2D3B4E',
        },
      },
      boxShadow: {
        soft: '0 4px 14px 0 rgba(0, 0, 0, 0.35)',
      },
      borderRadius: {
        xl2: '1rem',
      },
    },
  },
  plugins: [],
}
