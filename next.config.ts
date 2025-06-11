import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
};

export default nextConfig;

const { loadConfig } = require('./.nextconfig-loader');

module.exports = loadConfig();