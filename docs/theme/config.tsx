import { ReactNode } from 'react'
import makePathRegex from 'regexparam'

export { usePage } from './utils/PageContext'

export interface ThemeConfig {
  logo?: ReactNode
  topRight?: (ReactNode | { text: string; href: string })[]
  renderError: (error: Error) => ReactNode
  renderLoading: () => ReactNode
  renderNotFound?: (data: any) => ReactNode
  overrides?: {
    [path: string]: Omit<Partial<ThemeConfig>, 'pathOverrides'>
  }
}

export interface PageConfig extends Omit<ThemeConfig, 'pathOverrides'> {
  path: string
}

type PathRegexCache = { [path: string]: RegExp }
let pathRegexCache: PathRegexCache

const pageConfigs: { [path: string]: PageConfig } = {}

export function resolvePageConfig(
  path: string,
  { overrides: pageOverrides, ...config }: ThemeConfig
): PageConfig {
  if (pageConfigs[path]) {
    return pageConfigs[path]
  }

  if (pageOverrides) {
    pathRegexCache ??= Object.keys(pageOverrides).reduce((cache, route) => {
      cache[path] = makePathRegex(route).pattern
      return cache
    }, {} as PathRegexCache)

    for (const route in pathRegexCache) {
      if (pathRegexCache[route].test(path)) {
        Object.assign(config, pageOverrides[route])
        break
      }
    }
  }

  return {
    path,
    ...config,
  }
}
