import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Dev server only accepts localhost by default; allow ngrok tunnels.
  allowedDevOrigins: ["*.ngrok-free.app", "*.ngrok-free.dev", "*.ngrok.app", "*.ngrok.dev", "*.ngrok.io"],
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
