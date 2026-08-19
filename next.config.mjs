// Placeholder — set to your repo name so assets/routes resolve under
// https://<user>.github.io/<repo>/. Leave empty for a user/org root site
// (<user>.github.io) or local dev.
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  basePath: BASE_PATH,
  assetPrefix: BASE_PATH ? `${BASE_PATH}/` : undefined,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
