/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          main: 'var(--primary-main)',
          dark: 'var(--primary-dark)',
          light: 'var(--primary-light)',
        },
        secondary: {
          light: '#B3C0A4', // Light sage
          main: '#8DAA7B',  // Sage
          dark: '#6A8E58',  // Dark sage
        },
        neutral: {
          lightest: '#FFFBF1', // Cream 
          light: '#F7F0DE',    // Light cream
          medium: '#E8DFC9',   // Medium cream
          dark: '#CCC3AF',     // Dark cream
        },
        feedback: {
          success: '#7FB069', // Green
          error: '#FF6B6B',   // Red 
          warning: '#FFBE0B', // Yellow
          info: '#74B3CE',    // Blue
        },
      },
    },
  },
  plugins: [],
}
