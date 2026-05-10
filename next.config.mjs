/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@anthropic-ai/sdk'],
  },
  images: {
    domains: ['wrife.co.uk', 'app.wrife.co.uk'],
  },
};

export default nextConfig;
