/**
 * Calls are limited to once per the given timeout.
 *
 * The last call's arguments are used when the timeout completes.
 */
export function limitCalls<T extends any[]>(
  callback: (...args: T) => void,
  timeout: number
) {
  let id: any = -1
  let nextArgs: T
  return (...args: T) => {
    nextArgs = args
    if (id < 0) {
      id = setTimeout(() => {
        id = -1
        callback(...nextArgs)
      }, timeout)
    }
  }
}
