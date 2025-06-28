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
  };
  
  export default nextConfig;