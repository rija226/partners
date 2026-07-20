import type { NextConfig } from "next";
import { i18n } from "./next-i18next.config";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  i18n: i18n as NextConfig["i18n"],
  compiler: { styledComponents: true },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "images.ctfassets.net" }],
  },
  // next-i18next's serverSideTranslations reads both the config and the actual translation
  // JSON files from disk at runtime (not static imports), so Next's serverless file tracer
  // misses them — without this, deployed functions (Netlify/Vercel) either throw "unable to
  // find a user config" or silently render raw i18n keys ("accommodation.label") instead of
  // translated text.
  outputFileTracingIncludes: {
    "/**": ["./next-i18next.config.js", "./public/locales/**/*.json"],
  },
};

export default nextConfig;
