/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export for Vercel deployment without backend
  output: 'export',

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

  // Ensure trailing slashes for static export
  trailingSlash: true,
};

module.exports = nextConfig;
