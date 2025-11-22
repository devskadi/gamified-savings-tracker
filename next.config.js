/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow images from PokéAPI sprites
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        pathname: '/PokeAPI/sprites/**',
      },
    ],
  },
};

module.exports = nextConfig;
