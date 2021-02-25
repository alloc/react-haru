import { ReactNode } from 'react'
import makePathRegex from 'regexparam'
import { IPagesStaticData } from 'vite-plugin-react-pages'

export interface ThemeConfig {
  logo?: ReactNode
  pathOverrides?: {
    [path: string]: Partial<ThemeConfig>
  }
  renderError: PageView
  renderLoading: PageView
  renderNotFound?: PageView
}

export interface PageView {
  (props: {
    data: any
    page: any
    pages: IPagesStaticData
    config: PathConfig
  }): ReactNode
}

export interface PathConfig extends Omit<ThemeConfig, 'pathOverrides'> {
  path: string
}

type PathRegexCache = { [path: string]: RegExp }
let pathRegexCache: PathRegexCache

const pathConfigCache: { [path: string]: PathConfig } = {}

export function resolvePathConfig(
  path: string,
  { pathOverrides, ...config }: ThemeConfig
): PathConfig {
  if (pathConfigCache[path]) {
    return pathConfigCache[path]
  }

  let overrides: Partial<ThemeConfig> | undefined
  if (pathOverrides) {
    pathRegexCache ??= Object.keys(pathOverrides).reduce((cache, route) => {
      cache[path] = makePathRegex(route).pattern
      return cache
    }, {} as PathRegexCache)

    for (const route in pathRegexCache) {
      if (pathRegexCache[route].test(path)) {
        overrides = pathOverrides[route]
        break
      }
    }
  }

  return {
    path,
    ...config,
    ...overrides,
  }
}
