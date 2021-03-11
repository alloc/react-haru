import { useState } from 'react'
import { FluidValue, getFluidValue } from 'fluids'
import { useObserver } from './useObserver'

/** Render whenever the given `FluidValue` is changed. */
export function useValue<T>(target: FluidValue<T>): T

export function useValue<T extends object>(target: T): T

export function useValue(target: object) {
  const [value, setValue] = useState(() => getFluidValue(target))
  useObserver(target, event => {
    if (event.type == 'change') {
      setValue(event.value)
    }
  })
  return value
}
