import { useMemo } from 'react'
import { AsyncResult, Controller } from 'react-haru/web'
import { o } from 'wana'

export interface Tracker {
  (ctrl: Controller, resultPromise: AsyncResult): void
}

export interface TrackedState {
  active: boolean
  ctrls: Map<Controller, Set<AsyncResult>>
  idlePromise: Promise<void>
}

export function useTracker(): [Tracker, TrackedState] {
  const state = useMemo(
    () =>
      o<TrackedState>({
        active: false,
        ctrls: new Map(),
        idlePromise: Promise.resolve(),
      }),
    []
  )
  return [
    (ctrl, result) => {
      const { ctrls } = state
      const results = ctrls.get(ctrl) || new Set()
      if (!results.size) {
        if (!ctrls.size) {
          state.active = true
        }
        ctrls.set(ctrl, results)
      }
      results.add(result)
      state.idlePromise = Promise.all([
        state.idlePromise,
        result.finally(() => {
          results.delete(result)
          if (!results.size) {
            ctrls.delete(ctrl)
            if (!ctrls.size) {
              state.active = false
            }
          }
        }),
      ]).then(() => {
        // no-op
      })
    },
    state,
  ]
}
