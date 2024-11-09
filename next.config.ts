import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  output: "export",
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(glsl|vert)$/,
      type: "asset/source",
    })

    return config
  },
}

export default nextConfig
