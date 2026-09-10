const path = require('path');
const {defineConfig} = require('vite');
const react = require('@vitejs/plugin-react');

module.exports = defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: /^react-native$/,
        replacement: path.resolve(
          __dirname,
          'node_modules/react-native-web/dist/index.js',
        ),
      },
      {
        find: path.resolve(__dirname, 'src/database/database.ts'),
        replacement: path.resolve(__dirname, 'web/database.ts'),
      },
      {
        find: path.resolve(__dirname, 'src/services/secureStorage.ts'),
        replacement: path.resolve(__dirname, 'web/secureStorage.ts'),
      },
    ],
  },
  optimizeDeps: {
    exclude: ['react-native'],
  },
});
