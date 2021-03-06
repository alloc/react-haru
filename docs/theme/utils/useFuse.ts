import Fuse from 'fuse.js'
import { useMemo, useState } from 'react'
import { useObjectMemo } from './useObjectMemo'

interface FuseConfig<T> extends Fuse.IFuseOptions<T> {
  matchAllIfEmpty?: boolean
  limit?: number
}

export function useFuse<T>(
  items: T[],
  { matchAllIfEmpty, limit = Infinity, ...config }: FuseConfig<T> = {}
) {
  config = useObjectMemo(config)
  const fuse = useMemo(() => new Fuse(items, config), [items, config])
  const [pattern, search] = useState('')
  const results = useMemo(
    () =>
      matchAllIfEmpty && !pattern
        ? createResults(items)
        : fuse.search(pattern, { limit }),
    [fuse, pattern, limit, matchAllIfEmpty]
  )
  return [results, search] as const
}

function createResults<T>(items: T[]): Fuse.FuseResult<T>[] {
  return items.map((item, refIndex) => ({ item, refIndex }))
}
