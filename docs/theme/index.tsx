import React, { ReactNode } from 'react'
import { Theme } from 'vite-plugin-react-pages'
import { Layout } from './layout'
import { Markdown } from './layout/mdx'
import { usePage } from './utils/PageContext'
import { ThemeConfig, PathConfig, resolvePathConfig } from './config'

import './styles/global.sass'
import 'windi.css'

export function createTheme(config: ThemeConfig): Theme {
  function Page(props: { status: string; data: any }) {
    const renderPage = getPageView(props.status, usePage().config)
    return <>{renderPage(props.data)}</>
  }

  return ({ staticData, loadedData, loadState }) => {
    const path = loadState.routePath
    return (
      <Layout
        context={{
          path,
          page: staticData[path],
          pages: staticData,
          config: resolvePathConfig(path, config),
        }}>
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
  config: PathConfig
): (data: any) => ReactNode {
  switch (status) {
    case 'loaded':
      return (data: { [id: string]: { default: React.ComponentType } }) => {
        const { page } = usePage()
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
      return config.renderError
    default:
      return (
        config.renderNotFound ||
        (() => {
          const page = usePage('/404')
          const NotFound = page?.main?.default
          return NotFound ? <NotFound /> : <p>Page not found.</p>
        })
      )
  }
}
