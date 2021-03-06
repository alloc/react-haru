import React, { ReactNode, useMemo } from 'react'
// import { reportRuntimeError } from 'react-error-overlay'
import { Theme, useStaticData } from 'vite-plugin-react-pages/dist/client'
import { Layout } from './layout'
import { Markdown } from './layout/mdx'
import { usePage } from './utils/PageContext'
import { ThemeConfig, PageConfig, resolvePageConfig } from './config'

import './styles/global.sass'
import 'windi.css'

export function createTheme(config: ThemeConfig): Theme {
  function Page(props: { status: string; data: any }) {
    const renderPage = getPageView(props.status, usePage())
    return <>{renderPage(props.data)}</>
  }

  return ({ loadedData, loadState }) => {
    const path = loadState.routePath
    const page = useMemo(() => resolvePageConfig(path, config), [path])
    return (
      <Layout page={page}>
        <Page
          key={path + ':' + loadState.type}
          status={loadState.type}
          data={(loadState as any).error || loadedData[path]}
        />
      </Layout>
    )
  }
}

export { Layout }

function getPageView(
  status: string,
  config: PageConfig
): (data: any) => ReactNode {
  switch (status) {
    case 'loaded':
      return (data: { [id: string]: { default: React.ComponentType } }) => {
        const page = useStaticData(config.path)
        const sections = Object.entries(data)
        return (
          <>
            {sections.map(([id, { default: Content }], i) => {
              const Container =
                page[id].sourceType === 'md' ? Markdown : React.Fragment

              const content = (
                <Container>
                  {page.title && <h2>{page.title}</h2>}
                  {page.description && <p>{page.description}</p>}
                  <Content />
                </Container>
              )

              return sections.length > 1 ? (
                <section key={i} className="m-40px">
                  {content}
                </section>
              ) : (
                <React.Fragment key={i}>{content}</React.Fragment>
              )
            })}
          </>
        )
      }
    case 'loading':
      return config.renderLoading
    case 'load-error':
      const { renderError } = config
      return error => {
        if (import.meta.env.DEV) {
          // reportRuntimeError(error)
          console.error(error)
        }
        return renderError(error)
      }
    default:
      return config.renderNotFound || (() => null)
  }
}
