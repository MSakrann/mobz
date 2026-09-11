import type { NextConfig } from "next";

function supabaseImageRemotePatterns(): NonNullable<
  NextConfig["images"]
>["remotePatterns"] {
  const fallback = {
    protocol: "https" as const,
    hostname: "**",
    pathname: "/storage/v1/object/public/**",
  };

  const raw = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!raw) {
    return [fallback];
  }

  try {
    const parsed = new URL(raw);
    return [
      {
        protocol: parsed.protocol === "http:" ? "http" : "https",
        hostname: parsed.hostname,
        pathname: "/storage/v1/object/public/**",
      },
    ];
  } catch {
    return [fallback];
  }
}

const nextConfig: NextConfig = {
  // Drop the `X-Powered-By: Next.js` response header.
  poweredByHeader: false,

  compiler: {
    // Strip `console.*` from production bundles, keeping error/warn for
    // monitoring. Left on in dev so logs stay available.
    removeConsole:
      process.env.NODE_ENV === "production"
        ? { exclude: ["error", "warn"] }
        : false,
  },

  images: {
    remotePatterns: supabaseImageRemotePatterns(),
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 640, 768, 1024, 1280, 1440, 1920, 2560],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  async rewrites() {
    return [{ source: "/drape", destination: "/lumora.html" }];
  },
};

export default nextConfig;
