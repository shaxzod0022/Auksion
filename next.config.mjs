/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "considerate-integrity-production.up.railway.app",
        pathname: "/upload/**",
      },
    ],
  },
};

export default nextConfig;
