/** @type {import('prettier').Config} */
module.exports = {
  plugins: [require('prettier-plugin-tailwindcss')],
  tailwindFunctions: ['clsx'],

  trailingComma: 'all',
  semi: false,
  jsxSingleQuote: true,
  singleQuote: true,
  tabWidth: 3,
  useTabs: true,
};
