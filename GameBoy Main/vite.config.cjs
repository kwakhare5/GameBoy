const path = require('path')
const { defineConfig } = require('vite')
const react = require('@vitejs/plugin-react')
const tailwindcss = require('@tailwindcss/vite')

module.exports = defineConfig({
  plugins: [
    react.default(),
    tailwindcss.default(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    open: false,
  },
  assetsInclude: ['**/*.svg', '**/*.csv'],
})
