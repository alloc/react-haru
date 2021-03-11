import { Falsy } from '@alloc/types'
import { useRef } from 'react'

/**
 * When a function is passed, call it unless a value is cached already.
 */
export function useCache<T>(get: (() => T) | Falsy): T | null {
  const cache = useRef<T | null>(null)
  if (get && !cache.current) {
    cache.current = get()
  }
  return cache.current
}
