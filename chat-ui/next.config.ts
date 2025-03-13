import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "export",
  basePath: "",
  images: {
    unoptimized: true,
  },
  // This ensures trailing slashes are handled properly
  trailingSlash: true,
};

export default nextConfig;
