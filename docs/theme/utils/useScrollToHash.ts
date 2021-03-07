import { useCallback, useEffect, useRef } from 'react'
import { Queue } from './queue'
import { scrollTo } from './scroll'
import { useLocationHash } from './useLocationHash'

export function useScrollToHash(queue: Queue<Function>, negativeOffset = 0) {
  const hashRef = useRef('')
  const offsetRef = useRef(0)

  const scrollToHash = useCallback(() => {
    const hash = hashRef.current
    const target = document.getElementById(hash.slice(1))
    if (target) {
      scrollTo(target, offsetRef.current)
    } else {
      setTimeout(scrollToHash, 1000)
    }
  }, [])

  useEffect(() => {
    offsetRef.current = negativeOffset
  }, [negativeOffset])

  useLocationHash(hash => {
    if (hash) {
      hashRef.current = hash
      queue.add(scrollToHash)
    }
  })
}
