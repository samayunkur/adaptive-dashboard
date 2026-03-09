import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for Docker
  output: 'standalone',
  
  // Allow all hosts in development
  ...(process.env.NODE_ENV === 'development' && {
    allowedDevOrigins: ['localhost', '0.0.0.0', '.onrender.com', '.vercel.app'],
  }),
};

export default nextConfig;
