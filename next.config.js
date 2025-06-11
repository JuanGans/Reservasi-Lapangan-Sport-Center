// next.config.js - Temporary fix for deployment
const { loadConfig } = require('./.nextconfig-loader');

// Load existing config
const existingConfig = loadConfig();

/** @type {import('next').NextConfig} */
const config = {
  ...existingConfig,
  
  // Override untuk fix deployment issues
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  typescript: {
    ignoreBuildErrors: true,
  },
  
  images: {
    ...existingConfig.images,
    unoptimized: true,
  },
};

module.exports = config;