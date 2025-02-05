import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // PARA CONSULTAR AIS EXTERNAS
  images: {
    remotePatterns:[
      {
        protocol: 'https',
        hostname: 'https://dniruc.apisperu.com',
        port: '',
        pathname: '/*',
      },
      {
        protocol: 'https',
        hostname: 'https://res.cloudinary.com',
        port: '',
        pathname: '/*',
      }
    ]
  },
};

export default nextConfig;
