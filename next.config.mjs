/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Para despliegue en GitHub Pages (hosting estático)
  output: "export",
  basePath: "/patinete",
  trailingSlash: true,
  // Optimizacion de imagenes: en export estatico se debe desactivar el optimizador del servidor.
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
