// Placeholder — set to your repo name so assets/routes resolve under
// https://<user>.github.io/<repo>/. Leave empty for a user/org root site
// (<user>.github.io), Vercel, or local dev.
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

// Static export is only needed for GitHub Pages hosting. Vercel (and `next dev`)
// run the normal Next.js build, so this stays off unless explicitly requested.
const STATIC_EXPORT = process.env.NEXT_STATIC_EXPORT === "true";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  ...(STATIC_EXPORT ? { output: "export" } : {}),
  basePath: BASE_PATH,
  assetPrefix: BASE_PATH ? `${BASE_PATH}/` : undefined,
  trailingSlash: true,
  images: {
    unoptimized: STATIC_EXPORT,
  },
};

export default nextConfig;
