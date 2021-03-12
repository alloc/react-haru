import delay from 'delay'
import { useEffect } from 'react'
import { unstable_batchedUpdates as batchedUpdates } from 'react-dom'
import { withAuto } from 'wana'
import { useDemo } from './DemoContext'
import { Cycle } from './types'
import { TrackedState } from './useTracker'

interface Props {
  state: TrackedState
}

export const AppCycle = withAuto(({ state }: Props) => {
  const demo = useDemo()
  const { onCycle } = demo

  useEffect(() => {
    let paused = false
    let resume: () => void
    let resumePromise: Promise<void> | undefined
    let abortCtrl = new AbortController()

    const cycle: Cycle = {
      get cancelled() {
        return abortCtrl.signal.aborted
      },
      pause(flag) {
        if (paused == flag) return
        paused = flag
        if (flag) {
          resumePromise = new Promise(resolve => {
            resume = resolve
          })
        } else {
          resumePromise = undefined
          resume()
        }
      },
      awaitAnimation() {
        return getIdlePromise
      },
      delay: ms => () =>
        delay(ms, {
          signal: abortCtrl.signal,
        }).catch(() => {
          throw cycle
        }),
    }

    async function getIdlePromise(): Promise<void> {
      await state.idlePromise
      if (cycle.cancelled) {
        throw cycle
      }
      if (state.active) {
        return getIdlePromise() // Loop until idle.
      }
    }

    async function nextCycle(): Promise<void> {
      for (const action of onCycle(demo.props, cycle)) {
        // Wait for cycle to be resumed.
        await resumePromise

        let result: any
        batchedUpdates(() => {
          result = action()
        })
        await result

        // Break out of loop if cancelled.
        if (cycle.cancelled) {
          throw cycle
        }
      }
      await nextCycle()
    }

    console.log('startCycle:', cycle)
    demo.cycle = cycle
    nextCycle().catch(err => {
      err !== cycle && console.error(err)
    })

    return () => {
      demo.cycle = null
      abortCtrl.abort()
      console.log('stopCycle:', cycle)
    }
  }, [onCycle])

  return null
})
