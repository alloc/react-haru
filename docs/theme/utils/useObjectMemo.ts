import { useEffect, useRef } from 'react'
import { dequal } from 'dequal'

export function useObjectMemo<T extends object>(value: T) {
  const ref = useRef<T | null>(null)
  if (ref.current && dequal(ref.current, value)) {
    value = ref.current
  }
  useEffect(() => {
    ref.current = value
  }, [value])
  return value
}
