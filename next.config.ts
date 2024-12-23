/** @type {import('next').NextConfig} */
const config = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com'
      },
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com'
      }
    ]
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000']
    }
  }
};

export default config;
