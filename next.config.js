/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['jotai-devtools'],
  // experimental: {
  //   swcPlugins: [['@swc-jotai/react-refresh', {}], ['@swc-jotai/debug-label', {}]],
  // },
}

module.exports = nextConfig
