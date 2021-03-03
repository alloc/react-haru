import { useRef } from 'react'
import { useLayoutEffect } from 'react'
import { setScrollEnabled } from './scroll'

export function useScrollLock() {
  const locked = useRef(true)

  function unlock() {
    if (locked.current) {
      locked.current = false
      setScrollEnabled(true)
    }
  }

  useLayoutEffect(() => {
    setScrollEnabled(false)
    return unlock
  }, [])

  return unlock
}
