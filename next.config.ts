import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    // Ini mengizinkan next/image mengambil gambar dari Cloudinary.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
};

export default nextConfig;
