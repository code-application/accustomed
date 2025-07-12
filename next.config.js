/** @type {import('next').NextConfig} */
const nextConfig = {
  // 開発環境では静的エクスポートを無効にする
  ...(process.env.NODE_ENV === "production" && {
    output: "export",
    basePath: "/accustomed",
    assetPrefix: "/accustomed",
    trailingSlash: true,
    images: { unoptimized: true },
  }),
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
