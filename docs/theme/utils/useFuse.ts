import Fuse from 'fuse.js'
import { useMemo, useState } from 'react'
import { useObjectMemo } from './useObjectMemo'

interface FuseConfig<T> extends Fuse.IFuseOptions<T> {
  matchAllIfEmpty?: boolean
}

export function useFuse<T>(items: T[], config: FuseConfig<T> = {}) {
  config = useObjectMemo(config)
  const fuse = useMemo(() => new Fuse(items, config), [items, config])
  const [results, setResults] = useState(() =>
    config.matchAllIfEmpty ? createResults(items) : []
  )
  const search = (pattern: string, options?: Fuse.FuseSearchOptions) =>
    setResults(
      config.matchAllIfEmpty && !pattern
        ? createResults(items)
        : fuse.search(pattern, options)
    )
  return [results, search] as const
}

function createResults<T>(items: T[]): Fuse.FuseResult<T>[] {
  return items.map((item, refIndex) => ({ item, refIndex }))
}
