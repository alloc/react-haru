import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'
import mdx from 'vite-plugin-mdx'
import pages from 'vite-plugin-react-pages'
import path from 'path'

export default defineConfig({
  build: {
    minify: false,
    emptyOutDir: false,
  },
  plugins: [
    reactRefresh(),
    mdx(),
    pages({
      pagesDir: path.join(__dirname, 'pages'),
    }),
  ],
})
