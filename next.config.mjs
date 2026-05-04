/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // LinkedIn CDN hosts cover the post-image variants returned by RSS feeds.
    // Switch `unoptimized: true` if you build with `output: 'export'`.
    remotePatterns: [
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "media.licdn.com" },
      { protocol: "https", hostname: "media-exp1.licdn.com" },
      { protocol: "https", hostname: "media-exp2.licdn.com" },
      { protocol: "https", hostname: "static.licdn.com" },
      // SociableKIT's mirrored image CDN (more reliable than LinkedIn's
      // short-lived signed URLs)
      { protocol: "https", hostname: "data-image.sociablekit.com" },
      { protocol: "https", hostname: "data.accentapi.com" }
    ]
  }
};

export default nextConfig;
