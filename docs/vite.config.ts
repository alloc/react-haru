import { Theme } from 'windicss/types/interfaces'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import reactRefresh from '@vitejs/plugin-react-refresh'
import rehost from 'vite-plugin-rehost'
import mdx from 'vite-plugin-mdx'
import svg from 'vite-plugin-react-svg'
import demos from 'vite-plugin-demos'
import pages from 'vite-plugin-react-pages'
import windi from 'vite-plugin-windicss'
import parseMd, { Title } from 'markdown-ast'
import noMatter from 'nomatter'
import Slugger from 'github-slugger'

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
    mono: `SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace`,
  },
}

export default defineConfig({
  optimizeDeps: {
    exclude: ['react-haru', 'react-error-overlay', 'use-element-size', 'rafz'],
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
        fileExtensions: ['tsx', 'mdx', 'css'],
      },
    }),
    demos(),
    pages({
      async loadPageData(file, { loadPageData }) {
        const { pageId, staticData, ...rest } = await loadPageData(file)
        if (file.extname == 'mdx') {
          const ast = parseMd(noMatter(await file.read()))
          const slugger = new Slugger()
          const sections = ast
            .filter(node => node.type == 'title' && node.rank <= 3)
            .map(node => {
              const titleNode = node as Title
              const title = titleNode.block.reduce(
                (title, node) =>
                  title +
                  (node.type == 'text'
                    ? node.text
                    : node.type == 'codeSpan'
                    ? node.code
                    : ''),
                ''
              )
              const slug = slugger.slug(title)
              return [slug, title, titleNode.rank]
            })

          if (sections.length) {
            staticData.sections = sections
          }
        }
        return { pageId, staticData, ...rest }
      },
    }),
  ],
})
