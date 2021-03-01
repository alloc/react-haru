import { Theme } from 'windicss/types/interfaces'
import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'
import rehost from 'vite-plugin-rehost'
import mdx from 'vite-plugin-mdx'
import pages from 'vite-plugin-react-pages'
import windi from 'vite-plugin-windicss'
import path from 'path'

const defaultFont = `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif`

const colors = {
  red: '#F10F57',
  black: '#000',
  rose1: '#FFFAFB', // 348, 2, 100
  rose2: '#F2DFE3', // 348, 8, 95
  rose3: '#EBC9D0', // 349, 14, 92
  maroon: '#730015',
  deepPink: '#EB0071',
}

const theme: Theme = {
  colors,
  backgroundColor: {
    ...colors,
    code: '#FFEBEE',
  },
  letterSpacing: {
    tighter: '-.03em',
    tight: '-.015em',
    normal: '0',
  },
  fontFamily: {
    h: `AcehSoft, ${defaultFont}`,
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
