/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/api/projects",
        destination: "https://raw.githubusercontent.com/Alimadcorp/SOMPS/refs/heads/main/backend/projectsfinal.json",
        permanent: true,
      },
    ];
  },
};
export default nextConfig;
