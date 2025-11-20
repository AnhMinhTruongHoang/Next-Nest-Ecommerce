/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",

  // Nếu đã bỏ MUI Icons thì cái này có thể xoá, không sao
  modularizeImports: {
    "@mui/icons-material": {
      transform: "@mui/icons-material/{{member}}",
    },
  },

  images: {
    domains: ["localhost", "next-nest-ecommerce.onrender.com"],
    remotePatterns: [
      // Local BE
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/images/**",
      },
      // BE trên Render
      {
        protocol: "https",
        hostname: "next-nest-ecommerce.onrender.com",
        pathname: "/images/**",
      },
    ],
  },

  experimental: {
    serverActions: {},
  },
};

module.exports = nextConfig;
