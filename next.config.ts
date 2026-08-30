import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_ACTIONS === "true";

const nextConfig: NextConfig = {
  ...(isGitHubPages
    ? {
        output: "export",
        basePath: "/learn-jyotish",
        assetPrefix: "/learn-jyotish/",
        images: { unoptimized: true },
        trailingSlash: true,
        // The Pages bundle does not include the Cloudflare-only db/worker files;
        // those modules are still checked by the normal lint and Vinext builds.
        typescript: { ignoreBuildErrors: true },
      }
    : {}),
};

export default nextConfig;
