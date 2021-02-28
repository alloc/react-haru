import { useState } from 'react'
import { useElementSize } from 'use-element-size'

export function useHeight() {
  const [height, setHeight] = useState(-1)
  const ref = useElementSize(size => size && setHeight(size.height))
  return [ref, height] as const
}
