import React, { ReactNode, useMemo } from 'react'
import { ITheme, IPagesStaticData } from 'vite-plugin-react-pages'
import Layout from './layout'
import MD from './layout/mdx'
import { ThemeConfig, PageView, PathConfig, resolvePathConfig } from './config'

export const createTheme = (config: ThemeConfig): ITheme => ({
  staticData,
  loadedData,
  loadState,
}) => {
  const path = loadState.routePath
  config = resolvePathConfig(path, config)

  console.log('#Theme', config, staticData, loadedData, loadState)

  const renderPage = getPageView(loadState.type, config)
  const page = renderPage({
    data: (loadState as any).error || loadedData[path],
    page: staticData[path],
    pages: staticData,
    config,
  })

  return (
    <Layout path={path} config={config} pages={staticData}>
      {page}
    </Layout>
  )
}

export { Layout }

function getPageView(status: string, config: PathConfig): PageView {
  switch (status) {
    case 'loaded':
      return ({ data, page }) => {
        const dataParts = Object.entries(data) as [string, any][]
        return (
          <>
            {dataParts.map(([id, { default: Content }], i) => {
              const Container =
                data[id].sourceType === 'md' ? MD : React.Fragment
              const content = (
                <Container>
                  <Content />
                </Container>
              )
              if (dataParts.length > 1) {
                return (
                  <section style={{ marginBottom: '40px' }} key={i}>
                    <h2>{page.title}</h2>
                    {page.description && <p>{page.description}</p>}
                    {content}
                  </section>
                )
              }
              return <div key={i}>{content}</div>
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

// export function defaultMenu(pages: PagesStaticData): SideMenuData[] {
//   return (
//     Object.entries(pages)
//       // These special pages should not be showed in side menu
//       .filter(
//         ([path, staticData]) =>
//           path !== '/404' && !path.match(/\/:[^/]+/) && !staticData.hideInMenu
//       )
//       .sort((a, b) => {
//         const [pathA, staticDataA] = a
//         const [pathB, staticDataB] = b

//         let ASort: number
//         let BSort: number
//         if (staticDataA.sort !== undefined) ASort = Number(staticDataA.sort)
//         else if (staticDataA.main?.sort !== undefined)
//           ASort = Number(staticDataA.main.sort)
//         else ASort = 1
//         if (staticDataB.sort !== undefined) BSort = Number(staticDataB.sort)
//         else if (staticDataB.main?.sort !== undefined)
//           BSort = Number(staticDataB.main.sort)
//         else BSort = 1

//         if (ASort !== BSort) return ASort - BSort
//         return pathA.localeCompare(pathB)
//       })
//       .map(([path, staticData]) => {
//         return {
//           path,
//           text: staticData.title ?? staticData.main?.title ?? path,
//         }
//       })
//   )
// }
