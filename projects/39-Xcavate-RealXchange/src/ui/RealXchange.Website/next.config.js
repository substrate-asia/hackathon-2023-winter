/** @type {import('next').NextConfig} */
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'oaidalleapiprodscus.blob.core.windows.net'
      }
    ]
  },
  domains: ['oaidalleapiprodscus.blob.core.windows.net']
};
