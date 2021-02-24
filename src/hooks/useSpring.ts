import { Remap } from '../types'
import { is } from '../shared'

import { ControllerUpdate, PickAnimated, SpringValues } from '../core/types'
import { Valid } from '../core/types/common'
import { SpringRef } from '../core/SpringRef'
import { useSprings } from './useSprings'

/**
 * The props that `useSpring` recognizes.
 */
export type UseSpringProps<Props extends object = any> = unknown &
  PickAnimated<Props> extends infer State
  ? Remap<
      ControllerUpdate<State> & {
        /**
         * Used to access the imperative API.
         *
         * When defined, the render animation won't auto-start.
         */
        ref?: SpringRef<State>
      }
    >
  : never

/**
 * The `props` function is only called on the first render, unless
 * `deps` change (when defined). State is inferred from forward props.
 */
export function useSpring<Props extends object>(
  props:
    | Function
    | (() => (Props & Valid<Props, UseSpringProps<Props>>) | UseSpringProps),
  deps?: readonly any[] | undefined
): PickAnimated<Props> extends infer State
  ? [SpringValues<State>, SpringRef<State>]
  : never

/**
 * Updated on every render, with state inferred from forward props.
 */
export function useSpring<Props extends object>(
  props: (Props & Valid<Props, UseSpringProps<Props>>) | UseSpringProps
): SpringValues<PickAnimated<Props>>

/**
 * Updated only when `deps` change, with state inferred from forwad props.
 */
export function useSpring<Props extends object>(
  props: (Props & Valid<Props, UseSpringProps<Props>>) | UseSpringProps,
  deps: readonly any[] | undefined
): PickAnimated<Props> extends infer State
  ? [SpringValues<State>, SpringRef<State>]
  : never

/** @internal */
export function useSpring(props: any, deps?: readonly any[]) {
  const isFn = is.function(props)
  const [[values], ref] = useSprings(
    1,
    isFn ? props : [props],
    isFn ? deps || [] : deps
  )
  return isFn || arguments.length == 2 ? [values, ref] : values
}
