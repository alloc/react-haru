import { ReactNode } from 'react'
import makePathRegex from 'regexparam'
import { PagesStaticData } from 'vite-plugin-react-pages'

export interface ThemeConfig {
  logo?: ReactNode
  overrides?: {
    [path: string]: Omit<Partial<ThemeConfig>, 'pathOverrides'>
  }
  renderError: PageView
  renderLoading: PageView
  renderNotFound?: PageView
}

export interface PageView {
  (props: {
    data: Record<string, any>
    page: Record<string, any> & { title?: string }
    pages: PagesStaticData
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
  { overrides: pathOverrides, ...config }: ThemeConfig
): PathConfig {
  if (pathConfigCache[path]) {
    return pathConfigCache[path]
  }

  if (pathOverrides) {
    pathRegexCache ??= Object.keys(pathOverrides).reduce((cache, route) => {
      cache[path] = makePathRegex(route).pattern
      return cache
    }, {} as PathRegexCache)

    for (const route in pathRegexCache) {
      if (pathRegexCache[route].test(path)) {
        Object.assign(config, pathOverrides[route])
        break
      }
    }
  }

  return {
    path,
    ...config,
  }
}
