import { useState } from 'react'

export const useCancellableDelay = () =>
  useState(() => {
    let id: any = -1
    function runAfterDelay(fn: () => void, delay: number) {
      id = setTimeout(fn, delay)
    }
    runAfterDelay.cancel = () => clearTimeout(id)
    return runAfterDelay
  })[0]
