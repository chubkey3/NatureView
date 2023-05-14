/** @type {import('next').NextConfig} */

const withPWA = require("next-pwa");

const nextConfig = {
  reactStrictMode: false,
  env: {
    ACCESS_KEY_ID: process.env.ACCESS_KEY_ID,
    ACCESS_SECRET_KEY: process.env.ACCESS_SECRET_KEY
  }
}

const PWAConfig = withPWA({
  dest: "public",
  register: true,
  skipWaiting: true
})

module.exports = PWAConfig(nextConfig);
