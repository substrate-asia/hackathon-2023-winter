/** @type {import('next').NextConfig} */
module.exports = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'oaidalleapiprodscus.blob.core.windows.net',
        pathname: '/private/**'
      },
      {
        protocol: 'https',
        hostname: 'crustipfs.mobi'
      }
    ]
  }
};
