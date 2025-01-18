/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  basePath: '/svg-converter',
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig 