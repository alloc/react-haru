import { Theme } from 'windicss/types/interfaces'
import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'
import rehost from 'vite-plugin-rehost'
import mdx from 'vite-plugin-mdx'
import pages from 'vite-plugin-react-pages'
import windi from 'vite-plugin-windicss'
import path from 'path'

const theme: Theme = {
  backgroundColor: {
    red: '#F53657',
  },
}

export default defineConfig({
  optimizeDeps: {
    exclude: ['react-haru'],
  },
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    sourcemap: false,
    minify: false,
  },
  plugins: [
    reactRefresh(),
    rehost(),
    mdx(),
    windi({
      config: {
        theme,
      },
      preflight: {
        includeBase: false,
      },
      scan: {
        dirs: ['pages', 'theme'],
      },
    }),
    pages({
      pagesDir: path.join(__dirname, 'pages'),
    }),
  ],
})
