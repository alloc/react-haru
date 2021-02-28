import { useCallback, useRef } from 'react'
import { Queue } from './queue'
import { scrollTo } from './scroll'
import { useLocationHash } from './useLocationHash'

export function useScrollToHash(queue: Queue<Function>) {
  const hashRef = useRef('')
  const scrollToHash = useCallback(() => {
    const hash = hashRef.current
    const target = document.getElementById(hash.slice(1))
    if (target) {
      scrollTo(target)
    } else {
      setTimeout(scrollToHash, 1000)
    }
  }, [])

  useLocationHash(hash => {
    if (hash) {
      hashRef.current = hash
      queue.add(scrollToHash)
    }
  })
}
