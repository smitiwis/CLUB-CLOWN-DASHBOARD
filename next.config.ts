import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // PARA CONSULTAR AIS EXTERNAS
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        search: '',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_IMAGE_PATH: process.env.NEXT_PUBLIC_IMAGE_PATH,
  }
};

export default nextConfig;
