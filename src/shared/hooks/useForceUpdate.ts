import { useMemo, useState } from 'react'
import { useOnce } from './useOnce'

/** Return a function that re-renders this component, if still mounted */
export function useForceUpdate() {
  const update = useState<any>()[1]
  const mounted = useMemo(makeMountedRef, [])
  useOnce(mounted.unmount)
  return () => {
    if (mounted.current) {
      update({})
    }
  }
}

function makeMountedRef() {
  const mounted = {
    current: true,
    unmount: () => () => {
      mounted.current = false
    },
  }
  return mounted
}
