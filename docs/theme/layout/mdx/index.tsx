import React from 'react'
import { MDXProvider } from '@mdx-js/react'
import { CodeBlock } from './CodeBlock'
import { Anchor } from './Anchor'
import { makeHeading } from './Heading'

const components = {
  a: Anchor,
  h1: makeHeading('h1'),
  h2: makeHeading('h2'),
  pre: (props: any) => props.children,
  code: CodeBlock,
}

export const Markdown = ({ children }: any) => (
  <MDXProvider components={components}>
    <div className="markdown-body">{children}</div>
  </MDXProvider>
)
