import { createTheme } from 'vite-pages-theme-basic'
import * as React from 'react'

export default createTheme({
  topNavs: [
    { text: 'index', path: '/' },
    { text: 'Vite', href: 'https://github.com/vitejs/vite' },
    {
      text: 'Vite Pages',
      href: 'https://github.com/vitejs/vite-plugin-react-pages',
    },
  ],
  logo: <img src="/logo.svg" />,
})
