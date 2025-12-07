import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  assetPrefix: "./",
  output: "export",
  turbopack: {
    rules: {
      "*.{glsl,vert}": {
        as: "*.js",
        loaders: ["raw-loader"],
      },
    },
  },
}

export default nextConfig
