import { is } from '@alloc/is'
import { Arrify, AnyFn } from '../types'
import * as G from './globals'

export function noop() {}

export const defineHidden = (obj: any, key: any, value: any) =>
  Object.defineProperty(obj, key, { value, writable: true, configurable: true })

/** Compare animatable values */
export function isEqual(a: any, b: any) {
  if (is.array(a)) {
    if (!is.array(b) || a.length !== b.length) return false
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false
    }
    return true
  }
  return a === b
}

// Not all strings can be animated (eg: {display: "none"})
export const isAnimatedString = (value: unknown): value is string =>
  is.string(value) &&
  (value[0] == '#' || /\d/.test(value) || value in (G.colors || {}))

type EachFn<Value, Key, This> = (this: This, value: Value, key: Key) => void
type Eachable<Value = any, Key = any, This = any> = {
  forEach(cb: EachFn<Value, Key, This>, ctx?: This): void
}

/** Minifiable `.forEach` call */
export const each = <Value, Key, This>(
  obj: Eachable<Value, Key, This>,
  fn: EachFn<Value, Key, This>
) => obj.forEach(fn)

/** Iterate the properties of an object */
export function eachProp<T extends object, This>(
  obj: T,
  fn: (
    this: This,
    value: T extends any[] ? T[number] : T[keyof T],
    key: string
  ) => void,
  ctx?: This
) {
  for (const key in obj) {
    fn.call(ctx as any, obj[key] as any, key)
  }
}

export const toArray = <T>(a: T): Arrify<Exclude<T, void>> =>
  is.undefined(a) ? [] : is.array(a) ? (a as any) : [a]

/** Copy the `queue`, then iterate it after the `queue` is cleared */
export function flush<P, T>(
  queue: Map<P, T>,
  iterator: (entry: [P, T]) => void
): void
export function flush<T>(queue: Set<T>, iterator: (value: T) => void): void
export function flush(queue: any, iterator: any) {
  if (queue.size) {
    const items = Array.from(queue)
    queue.clear()
    each(items, iterator)
  }
}

/** Call every function in the queue with the same arguments. */
export const flushCalls = <T extends AnyFn>(
  queue: Set<T>,
  ...args: Parameters<T>
) => flush(queue, fn => fn(...args))