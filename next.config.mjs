/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'bosvgknxbuvjjdgzfekn.supabase.co'
            }
        ]
    }
}

export default nextConfig;