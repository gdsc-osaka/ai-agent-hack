/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
      return [
        {
          source: '/api/:path*', // '/api/'で始まる全リクエストが対象
          destination: 'http://localhost:8080/api/:path*', // バックエンドサーバー(8080)に転送
        },
      ];
    },
    images: {
      domains: ['images.pexels.com'],
      formats: ['image/webp', 'image/avif'],
      deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
      imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    },
    experimental: {
      optimizePackageImports: ['lucide-react'],
    },
    compiler: {
      removeConsole: process.env.NODE_ENV === 'production',
    },
    async headers() {
      return [
        {
          source: '/(.*)',
          headers: [
            { key: 'X-Frame-Options', value: 'DENY' },
            { key: 'X-Content-Type-Options', value: 'nosniff' },
            { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
            { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          ],
        },
      ];
    },
    output: 'standalone',
  };
  
  export default nextConfig;