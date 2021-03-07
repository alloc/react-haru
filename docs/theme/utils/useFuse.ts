import Fuse from 'fuse.js'
import { useMemo } from 'react'
import { useObjectMemo } from './useObjectMemo'

export interface FuseConfig<T> extends Fuse.IFuseOptions<T> {
  matchAllIfEmpty?: boolean
  limit?: number
}

export interface FuseResult<T = any> extends Fuse.FuseResult<T> {
  score: number
}

export function useFuse<T>(
  items: T[],
  pattern: string,
  { matchAllIfEmpty, limit = Infinity, ...config }: FuseConfig<T> = {}
) {
  config.includeScore = true
  config = useObjectMemo(config)
  const fuse = useMemo(() => new Fuse(items, config), [items, config])
  return useMemo(
    () =>
      matchAllIfEmpty && !pattern
        ? createResults(items)
        : fuse.search(pattern, { limit }),
    [fuse, pattern, limit, matchAllIfEmpty]
  ) as FuseResult<T>[]
}

function createResults<T>(items: T[]): Fuse.FuseResult<T>[] {
  return items.map((item, refIndex) => ({ item, refIndex, score: 0 }))
}
