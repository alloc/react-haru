import { useState } from 'react'
import { unstable_batchedUpdates as batchedUpdates } from 'react-dom'

export const useCancellableDelay = () =>
  useState(() => {
    let id: any = -1
    function runAfterDelay(fn: () => void, delay: number) {
      clearTimeout(id)
      id = setTimeout(() => batchedUpdates(fn), delay)
    }
    runAfterDelay.cancel = () => clearTimeout(id)
    return runAfterDelay
  })[0]
