const { defineConfig } = require('vite');
const path = require('path');
const { nodePolyfills } = require('vite-plugin-node-polyfills');

module.exports = defineConfig({
  root: '.',
  publicDir: 'public',
  plugins: [
    nodePolyfills({
      // To exclude specific polyfills, add them to this list
      exclude: [],
      // Whether to polyfill `node:` protocol imports.
      protocolImports: true,
    }),
  ],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    target: 'es2020',
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    open: true,
  },
});
