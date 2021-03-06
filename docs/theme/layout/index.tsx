import React from 'react'
import { a, useTransition } from 'react-haru/web'
import { PageConfig } from 'theme/config'
import { PageProvider } from '../utils/PageContext'
import { DocsLayout } from './DocsLayout'

interface Props {
  page: PageConfig
  children: any
}

export function Layout({ page, children }: Props) {
  const Layout = page.path == '/' ? NoLayout : DocsLayout

  const currentState = {
    key: Layout,
    layout: (
      // Cache the page context during leave transition.
      <PageProvider value={page}>
        <Layout>{children}</Layout>
      </PageProvider>
    ),
  }

  const renderLayout = useTransition(currentState, {
    key: state => state.key,
    config: { frequency: 0.3 },
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    lead: 'leave',
  })

  return renderLayout((style, { layout }) => (
    <a.div className="flex flex-col min-h-100vh bg-rose1" style={style}>
      {layout}
    </a.div>
  ))
}

function NoLayout(props: any) {
  return <>{props.children}</>
}
