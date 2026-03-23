/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
  },
  experimental: {
    // Tesseract.js requiere acceso al filesystem de Node.js
    serverComponentsExternalPackages: ['tesseract.js'],
  },
}

module.exports = nextConfig
