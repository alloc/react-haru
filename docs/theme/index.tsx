import React from 'react'
import { Theme } from 'vite-plugin-react-pages'
import Layout from './layout'
import MD from './layout/mdx'
import { ThemeConfig, PageView, PathConfig, resolvePathConfig } from './config'

export const createTheme = (config: ThemeConfig): Theme => ({
  staticData,
  loadedData,
  loadState,
}) => {
  const path = loadState.routePath
  const pathConfig = resolvePathConfig(path, config)
  const renderPage = getPageView(loadState.type, pathConfig)

  const pageData = staticData[path]
  const pageElement = renderPage({
    data: (loadState as any).error || loadedData[path],
    page: staticData[path],
    pages: staticData,
    config: pathConfig,
  })

  return (
    <Layout path={path} page={pageData} config={config} pages={staticData}>
      {pageElement}
    </Layout>
  )
}

export { Layout }

function getPageView(status: string, config: PathConfig): PageView {
  switch (status) {
    case 'loaded':
      return ({ data, page }) => {
        const sections = Object.entries(data)
        return (
          <>
            {sections.map(([id, { default: Content }], i) => {
              const Container =
                page[id].sourceType === 'md' ? MD : React.Fragment

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
        (props => {
          const NotFound = props.pages['/404']?.main?.default
          return NotFound ? <NotFound {...props} /> : <p>Page not found.</p>
        })
      )
  }
}
