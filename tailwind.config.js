/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,json}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#FAF8F5',
        primary: '#110F0D',
        'primary-alt': '#16130F',
        surface: '#1C1814',
        accent: '#C9A84C',
        dark: '#110F0D',
        textDark: '#2A2A35',
      },
      fontFamily: {
        heading: ['Inter', 'sans-serif'],
        drama: ['"Playfair Display"', 'serif'],
        data: ['"JetBrains Mono"', 'monospace'],
        batang: ['Batang', '"Times New Roman"', 'serif'],
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}

