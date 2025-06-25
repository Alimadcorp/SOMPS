/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/api/projects",
        destination:
          "https://raw.githubusercontent.com/Alimadcorp/SOMPS/refs/heads/main/backend/projectsfinal.json",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "summer.hackclub.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "avatars.slack-edge.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "hc-cdn.hel1.your-objectstorage.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "secure.gravatar.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "client-of-making.quntem.co.uk",
        pathname: "**",
      },
    ],
  },
};
export default nextConfig;
