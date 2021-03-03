import React from 'react'
import { a, useTransition } from 'react-haru/web'
import { usePage } from '../utils/PageContext'
import { DocsLayout } from './DocsLayout'

export function Layout(props: any) {
  const { path } = usePage()

  const Layout = path == '/' ? NoLayout : DocsLayout
  const renderLayout = useTransition(<Layout {...props} />, {
    key: layout => layout.type,
    config: { frequency: 0.3 },
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    lead: 'leave',
  })

  return renderLayout((style, layout) => (
    <a.div className="flex flex-col min-h-100vh bg-rose1" style={style}>
      {layout}
    </a.div>
  ))
}

function NoLayout(props: any) {
  return <>{props.children}</>
}
