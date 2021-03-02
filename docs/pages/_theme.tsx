import { createTheme } from '../theme'
import * as React from 'react'
import 'windi.css'

import ErrorPage from '../components/Error'
import LoadingPage from '../components/Loading'
import { DocsFilter } from '../components/DocsFilter'
import { Attraction } from '../theme/utils/Attraction'

const Theme = createTheme({
  logo: <img src="/logo.svg" />,
  renderError: () => <ErrorPage />,
  renderLoading: () => <LoadingPage />,
  topRight: [
    <DocsFilter />,
    { text: 'Bounties', href: 'https://issuehunt.io/r/alloc/react-haru' },
    { text: 'Free Tier', href: '/pricing?free' },
    { text: 'Pricing', href: '/pricing' },
    // { text: 'Help', href: 'https://github.com/alloc/react-haru/issues/new' },
    <a
      href="https://github.com/alloc/react-haru"
      target="_blank"
      className="flex font-700">
      <Attraction className="flex items-center">
        <img src="/github.svg" className="w-6.4" />
      </Attraction>
    </a>,
  ],
  overrides: {
    '/': {
      logo: null,
    },
  },
})

// Enable react-refresh by exporting a component.
export default (props: any) => <Theme {...props} />
