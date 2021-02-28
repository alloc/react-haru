import React from 'react'
import { Theme } from 'vite-plugin-react-pages'
import { Layout } from './layout'
import { Markdown } from './layout/mdx'
import { ThemeConfig, PathConfig, resolvePathConfig } from './config'
import './styles/global.sass'
import { PageContext, usePage } from './utils/PageContext'

export function createTheme(config: ThemeConfig): Theme {
  const Page = ({ status, data }: { status: string; data: any }) => {
    const renderPage = getPageView(status, usePage().config)
    return <Layout>{renderPage(data)}</Layout>
  }
  return ({ staticData, loadedData, loadState }) => {
    const path = loadState.routePath
    const { Provider } = PageContext
    return (
      <Provider
        value={{
          path,
          page: staticData[path],
          pages: staticData,
          config: resolvePathConfig(path, config),
        }}>
        <Page
          status={loadState.type}
          data={(loadState as any).error || loadedData[path]}
        />
      </Provider>
    )
  }
}

export { Layout }

function getPageView(status: string, config: PathConfig) {
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
                <section className="m-40px" key={i}>
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
