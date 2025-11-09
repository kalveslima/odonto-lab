/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,         // ativa o modo estrito do React
  swcMinify: true,               // usa o compilador SWC para otimização
  compiler: {
    // necessário para Tailwind + Framer Motion (transpila classes e motion)
    styledComponents: false,     // se não usar styled-components
  },
  images: {
    // permite carregar imagens do diretório public ou externo
    domains: [],
  },
  experimental: {
    // habilita features futuras se quiser
    appDir: true,                // necessário para /app directory
  },
};

export default nextConfig;
