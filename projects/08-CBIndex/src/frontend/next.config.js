/** @type {import('next').NextConfig} */

import withAntdLess from "next-plugin-antd-less";

const nextConfig = {
  reactStrictMode: false,
  // swcMinify: true,
  swcMinify: true,
  async redirects() {
    return [
      {
        source: "/",
        destination: "/activefund/vaults",
        permanent: false,
      },
    ];
  },
  images: {
    domains: [
      "assets.cbindex.finance",
    ],
  },
  // less
  ...withAntdLess({
    cssMoudles: true,
    modifyVars: {
      "@--mobile-width-max-media": "1024px", // var() does not work in @media query
    },
  }),
};

export default nextConfig;
