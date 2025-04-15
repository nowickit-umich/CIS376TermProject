/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
    };
    return config;
  },
  experimental: {
    appDir: true,
  },
  reactStrictMode: true,
  swcMinify: true,
};

export default nextConfig;
  
