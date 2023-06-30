import type { Config } from 'tailwindcss';
import DaisyUi from 'daisyui';
import BackgroundPatterns from 'tailwindcss-bg-patterns';
import defaultTheme from 'tailwindcss/defaultTheme';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Space Grotesk"', ...defaultTheme.fontFamily.sans],
        mono: ['"Space Mono", "Jetbrains Mono"', 'Menlo', ...defaultTheme.fontFamily.mono],
      },
    },
  },
  plugins: [DaisyUi, BackgroundPatterns],
  daisyui: {
    themes: [
      {
        d4: {
          primary: '#f97316',
          secondary: '#c4b5fd',
          accent: '#c084fc',
          neutral: '#292524',
          'base-100': '#1c1917',
          info: '#22d3ee',
          success: '#34d399',
          warning: '#fbbf24',
          error: '#fb7185',
        },
      },
    ],
  },
};

export default config;
