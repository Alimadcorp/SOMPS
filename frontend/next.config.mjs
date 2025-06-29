/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,DELETE,PATCH,POST,PUT",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
          },
        ],
      },
    ];
  },
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
