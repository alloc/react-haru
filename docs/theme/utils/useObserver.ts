import { useEffect } from 'react'
import {
  addFluidObserver,
  removeFluidObserver,
  FluidEvent,
  FluidObserver,
  FluidValue,
} from 'fluids'

export function useObserver<T, E extends FluidEvent<T>>(
  target: FluidValue<T, E>,
  observer: FluidObserver<E>,
  deps?: readonly any[]
): void

export function useObserver(
  target: object,
  observer: FluidObserver,
  deps?: readonly any[]
): void

// Observer order may not be consistent between renders.
export function useObserver(target: any, observer: any, deps?: readonly any[]) {
  useEffect(() => {
    addFluidObserver(target, observer)
    return () => removeFluidObserver(target, observer)
  }, deps)
}
