/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "**docs.material-tailwind.com",
      },
    ],
  },
};

module.exports = nextConfig;
