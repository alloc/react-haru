import { Theme } from 'windicss/types/interfaces'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import reactRefresh from '@vitejs/plugin-react-refresh'
import rehost from 'vite-plugin-rehost'
import mdx from 'vite-plugin-mdx'
import svg from 'vite-plugin-react-svg'
import pages from 'vite-plugin-react-pages'
import windi from 'vite-plugin-windicss'
import path from 'path'

const defaultFont = `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif`

const colors = {
  red: '#F10F57',
  white: '#FFF',
  black: '#000',
  rose1: '#FFFAFB', // H 348, S 2, B 100
  rose2: '#F2DFE3', // H 348, S 8, B 95
  rose3: '#EBC9D0', // H 349, S 14, B 92
  maroon: '#730015',
  deepPink: '#EB0071', // B 92
  deepPink2: '#F50076', // B 96
  deepPink3: '#FF007B', // B 100
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
    sourcemap: true,
  },
  plugins: [
    tsconfigPaths(),
    reactRefresh(),
    rehost(),
    mdx(),
    svg({
      expandProps: 'end',
    }),
    windi({
      config: {
        theme,
      },
      preflight: {
        includeBase: false,
      },
      scan: {
        dirs: ['pages', 'theme', 'components'],
        fileExtensions: ['html', 'mdx', 'tsx'],
      },
    }),
    pages({
      pagesDir: path.join(__dirname, 'pages'),
    }),
  ],
})
