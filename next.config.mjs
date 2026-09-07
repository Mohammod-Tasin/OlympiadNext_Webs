/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Serve the hero (and any future next/image asset) as AVIF where the
    // browser accepts it, falling back to WebP.
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
