import type { NextConfig } from "next";
import { i18n } from "./next-i18next.config";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  i18n: i18n as NextConfig["i18n"],
  compiler: { styledComponents: true },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "images.ctfassets.net" }],
  },
  // next-i18next's serverSideTranslations reads this file from disk at runtime (not a static
  // import), so Next's serverless file tracer misses it — without this, deployed functions
  // (Netlify/Vercel) throw "unable to find a user config at next-i18next.config.js".
  outputFileTracingIncludes: {
    "/**": ["./next-i18next.config.js"],
  },
};

export default nextConfig;
