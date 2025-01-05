/** @type {import('next').NextConfig} */

const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "**",
            },
            {
                protocol: "http",
                hostname: "localhost",
                port: "5000",
            },
        ],
    },
    env: {
        BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
        AUTH_SECRET: process.env.AUTH_SECRET,
    },
};

export default nextConfig;
