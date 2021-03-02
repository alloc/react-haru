import React, { ReactNode } from 'react'
import { Theme } from 'vite-plugin-react-pages'
import { Layout } from './layout'
import { Markdown } from './layout/mdx'
import { PageContext, usePage } from './utils/PageContext'
import { ThemeConfig, PathConfig, resolvePathConfig } from './config'
import './styles/global.sass'

export function createTheme(config: ThemeConfig): Theme {
  const Page = (props: { status: string; data: any }) => {
    const page = usePage()
    const renderPage = getPageView(props.status, page.config)
    return <>{renderPage(props.data)}</>
  }
  return ({ staticData, loadedData, loadState }) => {
    const path = loadState.routePath
    const pageKey = path + ':' + loadState.type
    console.log('Theme.render:', pageKey)

    const { Provider } = PageContext
    return (
      <Provider
        value={{
          path,
          page: staticData[path],
          pages: staticData,
          config: resolvePathConfig(path, config),
        }}>
        <Layout>
          <Page
            key={pageKey}
            status={loadState.type}
            data={(loadState as any).error || loadedData[path]}
          />
        </Layout>
      </Provider>
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
