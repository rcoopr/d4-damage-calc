import type { Config } from 'tailwindcss';
import DaisyUi from 'daisyui';
import defaultTheme from 'tailwindcss/defaultTheme';
import plugin from 'tailwindcss/plugin';
import { Icons, type Options } from 'tailwindcss-plugin-icons';

const options: Options = () => ({
  solar: {
    icons: {
      'settings-minimalistic-outline': {},
    },
    includeAll: true,
    scale: 1.5,
    location: '@iconify-json/solar/icons.json',
  },
});

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Space Grotesk"', ...defaultTheme.fontFamily.sans],
        mono: ['"Space Mono", "Jetbrains Mono"', 'Menlo', ...defaultTheme.fontFamily.mono],
      },
      gridTemplateColumns: ({ theme }) => {
        const spacing = theme('spacing');

        return Object.keys(spacing).reduce((accumulator, spacingKey) => {
          return {
            ...accumulator,
            [`grid-fill-${spacingKey}`]: `repeat(auto-fill, minmax(${spacing[spacingKey]}, 1fr))`,
          };
        }, {});
      },
      transitionTimingFunction: {
        'out-quart': 'cubic-bezier(0.25, 1, 0.5, 1)',
      },
    },
  },
  plugins: [
    Icons(options),
    DaisyUi,
    plugin(function ({ addUtilities }) {
      addUtilities({
        // https://developer.mozilla.org/en-US/docs/Web/CSS/writing-mode
        '.writing-horizontal': { writingMode: 'horizontal-tb' },
        '.writing-vertical-rl': { writingMode: 'vertical-rl' },
        '.writing-vertical-lr': { writingMode: 'vertical-lr' },
        '.writing-initial': { writingMode: 'initial' },
        // https://developer.mozilla.org/en-US/docs/Web/CSS/text-orientation
        '.orientation-mixed': { textOrientation: 'mixed' },
        '.orientation-upright': { textOrientation: 'upright' },
        '.orientation-sideways-right': { textOrientation: 'sideways-right' },
        '.orientation-sideways': { textOrientation: 'sideways' },
        '.orientation-glyph': { textOrientation: 'use-glyph-orientation' },
        '.orientation-initial': { textOrientation: 'initial' },

        '.auto-height': {
          display: 'grid',
          gridTemplateRows: '0fr',
          transitionProperty: 'grid-template-rows',
          transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
          transitionDuration: '150ms',
          '& > *': {
            minHeight: '0',
            visibility: 'hidden',
            overflow: 'hidden',
            transitionProperty: 'visibility',
            transitionDuration: '150ms',
          },
        },
        '.auto-height-open': {
          gridTemplateRows: '1fr',
          '& > *': {
            visibility: 'visible',
          },
        },
      });
    }),
  ],
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
