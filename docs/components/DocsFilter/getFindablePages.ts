import type { PagesStaticData } from 'vite-plugin-react-pages'

export type FindablePage = {
  path: string
  title: string
  keywords?: string[]
}

export function getFindablePages(
  pages: PagesStaticData,
  includeSections?: boolean
) {
  const findablePages: FindablePage[] = []
  for (const path in pages) {
    const page = pages[path].main as StaticPageData
    if (page.title && !page.hideSelf) {
      findablePages.push({
        path,
        title: page.title,
        keywords: page.keywords,
      })
      if (includeSections && !page.hideSections)
        page.sections?.forEach(([slug, title, rank], i) => {
          if (rank > 1) return

          // Include sub-sections as keywords.
          const keywords: string[] = []
          while (++i < page.sections!.length) {
            const [, title, rank] = page.sections![i]
            if (rank > 1) {
              keywords.push(title.toLowerCase())
            }
          }

          findablePages.push({
            path: path + '#' + slug,
            title,
            keywords,
          })
        })
    }
  }
  return findablePages
}

export type SectionData = [slug: string, title: string, rank: number][]

export interface StaticPageData {
  title?: string
  keywords?: string[]
  sections?: SectionData
  /** Hide page from DocsFilter */
  hideSelf?: boolean
  /** Hide <h1> sections from DocsFilter */
  hideSections?: boolean
}
