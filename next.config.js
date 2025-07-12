/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/accustomed',
  assetPrefix: '/accustomed',
  trailingSlash: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
};

module.exports = nextConfig;
