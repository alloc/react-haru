import { createTheme } from '../theme'
import * as React from 'react'
import 'windi.css'

import ErrorPage from './error'
import LoadingPage from './loading'

export default createTheme({
  logo: <img src="/logo.svg" className="w-100px" />,
  pathOverrides: {
    '/': {
      logo: null,
    },
  },
  renderError: () => <ErrorPage />,
  renderLoading: () => <LoadingPage />,
  // navRight: [
  //   { text: 'Search', path: '/search' },
  //   { text: 'GitHub', href: 'https://github.com/alloc/react-haru' },
  // ],
})
