import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'
import rehost from 'vite-plugin-rehost'
import mdx from 'vite-plugin-mdx'
import pages from 'vite-plugin-react-pages'
import windi from 'vite-plugin-windicss'
import path from 'path'

export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    minify: false,
  },
  plugins: [
    reactRefresh(),
    rehost(),
    mdx(),
    windi(),
    pages({
      pagesDir: path.join(__dirname, 'pages'),
    }),
  ],
})
