const tsNode = require('ts-node');
const path = require('path');

tsNode.register({
  transpileOnly: true,
  compilerOptions: {
    module: 'commonjs',
  },
});

/** @returns {import('next').NextConfig} */
exports.loadConfig = () => {
  const configPath = path.resolve(__dirname, 'next.config.ts');
  const config = require(configPath);
  return config.default || config;
};
