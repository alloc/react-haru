import { useState } from 'react'
import { useElementSize } from 'use-element-size'

export function useHeight(
  filter: (height: number, prevHeight: number) => boolean = () => true
) {
  const [height, setHeight] = useState(-1)
  const ref = useElementSize(
    (size, prevSize) =>
      size &&
      filter(size.height, prevSize ? prevSize.height : -1) &&
      setHeight(size.height)
  )
  return [ref, height] as const
}
