/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#08090b',
        panel: '#151619',
        line: '#303236',
        signal: '#3dd6c6',
        amber: '#f6c85f',
        rose: '#f36f7b',
        violet: '#9b8cff',
      },
      boxShadow: {
        projection: '0 18px 50px rgba(0, 0, 0, 0.28)',
      },
    },
  },
  plugins: [],
};
