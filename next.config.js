/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: false,
  env: {
    ACCESS_KEY_ID: process.env.ACCESS_KEY_ID,
    ACCESS_SECRET_KEY: process.env.ACCESS_SECRET_KEY,
    BUCKET_NAME: process.env.BUCKET_NAME,
    BUCKET_ENDPOINT: process.env.BUCKET_ENDPOINT,
    PROD: process.env.PROD
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: process.env.BUCKET_NAME + '.' + process.env.BUCKET_ENDPOINT,
        port: '',
        pathname: '/images/**'
      }
    ]
  }
}

if (process.env.PROD === "true"){
  const withPWA = require("next-pwa");

  const PWAConfig = withPWA({
    dest: "public",
    register: true,
    skipWaiting: true,
    disableDevLogs: true
  })

  module.exports = PWAConfig(nextConfig);

} else {
  module.exports = nextConfig
}
