import { useState } from 'react'

// Note: The `onFlush` callback is assumed static.
export function useQueue<T>(onFlush: (value: T) => void): Queue<T> {
  return useState(() => makeQueue(onFlush))[0]
}

export function makeQueue<T>(onFlush: (value: T) => void): Queue<T> {
  let queue: Set<T> | null = new Set()
  return {
    add(value) {
      if (queue) queue.add(value)
      else onFlush(value)
    },
    flush() {
      queue?.forEach(onFlush)
      queue = null
    },
  }
}

export interface Queue<T> {
  add(value: T): void
  flush(): void
}
