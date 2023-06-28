/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Space Grotesk"'],
        mono: ['"Jetbrains Mono"', 'Menlo'],
      },
    },
  },
  plugins: [],
};
