import { FuseResult } from 'theme/utils/useFuse'
import { FindablePage } from './getFindablePages'

export interface SectionHeader {
  key: string
  title: string
}

export interface SectionGroup {
  key: string
  title: string
  sections: FuseResult<FindablePage>[]
}

export interface GroupedResults
  extends Array<SectionHeader | FuseResult<FindablePage>> {}

/** Group section results by page */
export function groupSections(
  results: FuseResult<FindablePage>[]
): GroupedResults {
  const groups = new Map<FindablePage, SectionGroup>()
  const nextResults: [FuseResult<FindablePage>[], ...SectionGroup[]] = [[]]
  results.forEach(result => {
    const page = result.item.parent
    if (page) {
      let group = groups.get(page)
      if (!group) {
        group = { key: 's:' + page.path, title: page.title, sections: [] }
        groups.set(page, group)
        nextResults.push(group)
      }
      group.sections.push(result)
    } else if (
      nextResults.length == 1 ||
      result.score > nextResults[1].sections[0].score / 2
    ) {
      nextResults[0].push(result)
    }
  })
  // Flatten the results to be compatible with `useTransition` hook.
  return nextResults.flatMap(result =>
    Array.isArray(result)
      ? result
      : ([result] as GroupedResults).concat(result.sections)
  )
}
