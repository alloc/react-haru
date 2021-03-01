import React from 'react'
import Highlight, { defaultProps } from 'prism-react-renderer'
import theme from 'prism-react-renderer/themes/github'
import type { Language } from 'prism-react-renderer'

export function CodeBlock({ children = '', className = '' }: any) {
  const language = className.replace(/language-/, '') as Language
  return (
    <Highlight
      {...defaultProps}
      theme={theme}
      code={children.trim()}
      language={language}>
      {({ className, tokens, getLineProps, getTokenProps }) => (
        <pre className={className}>
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line, key: i })}>
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({ token, key })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  )
}
