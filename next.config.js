/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'tuba-nextjs-meals-users-image.s3.eu-north-1.amazonaws.com',
          port: '',
          pathname: '/**',
        },
      ],
    },
  };

module.exports = nextConfig
