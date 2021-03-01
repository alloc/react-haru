import { ReactNode } from 'react'
import makePathRegex from 'regexparam'

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
