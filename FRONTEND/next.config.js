/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lywdsfdbvsjxzkvfnmbh.supabase.co",
        port: "",
        pathname: "/storage/**",
      },
    ],
  },
  outputFileTracingIncludes: {
    "/app/actions/generate-pdf": [
      "./public/fonts/Poppins-Regular.otf",
      "./public/fonts/Poppins-Bold.otf",
    ],
  },
};

module.exports = nextConfig;
